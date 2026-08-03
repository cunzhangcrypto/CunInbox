<template>
  <div class="assistant-box">
    <!-- 当前 AI 模型状态徽章 -->
    <div class="ai-model-bar">
      <div class="ai-model-info">
        <Icon icon="mdi:cpu-32-bit" width="16" height="16" />
        <span class="ai-model-label">当前 AI：</span>
        <el-tag :type="currentAiTagType" size="small" effect="dark">
          <Icon :icon="currentAiIcon" width="13" height="13" style="vertical-align: -2px; margin-right: 4px;" />
          {{ currentAiLabel }}
        </el-tag>
        <el-tag v-if="aiStatusInfo.fallbackEnabled" type="info" size="small" effect="plain" style="margin-left: 6px;">
          降级已启用
        </el-tag>
      </div>
      <el-tooltip effect="dark" content="刷新 AI 状态" placement="left">
        <Icon class="ai-refresh-icon" icon="ion:reload" width="16" height="16" @click="loadAiStatus" />
      </el-tooltip>
    </div>

    <div class="tabs-row">
      <div class="tab-item" :class="{active: tab === 'digest'}" @click="tab = 'digest'">
        <Icon icon="mdi:newspaper-variant-outline" width="18" height="18" />
        <span>CunInbox Daily</span>
      </div>
      <div class="tab-item" :class="{active: tab === 'discovery'}" @click="tab = 'discovery'">
        <Icon icon="mdi:lightbulb-on-outline" width="18" height="18" />
        <span>身份发现</span>
        <el-badge :value="newIdentities.length" :hidden="newIdentities.length === 0" />
      </div>
      <div class="tab-item" :class="{active: tab === 'chat'}" @click="tab = 'chat'">
        <Icon icon="mdi:robot-outline" width="18" height="18" />
        <span>AI 对话</span>
      </div>
    </div>

    <!-- 每日摘要 -->
    <div v-if="tab === 'digest'" class="digest-panel">
      <div class="panel-header">
        <div class="panel-title">每日邮件摘要</div>
        <el-button type="primary" size="small" @click="generateToday" :loading="genLoading">
          生成今日摘要
        </el-button>
      </div>
      <div class="digest-list" v-loading="digestLoading">
        <div class="digest-card" v-for="item in digestList" :key="item.digestId">
          <div class="digest-date">
            <Icon icon="mdi:calendar-blank-outline" width="16" height="16" />
            {{ item.digestDate }}
            <el-tag size="small" type="warning" v-if="item.importantCount > 0">{{ item.importantCount }}封重要</el-tag>
          </div>
          <div class="digest-text" v-html="formatContent(item.content)"></div>
        </div>
        <div class="empty" v-if="!digestLoading && digestList.length === 0">
          <Icon icon="mdi:robot-confused-outline" width="48" height="48" />
          <div>暂无摘要，点击右上角生成</div>
        </div>
      </div>
    </div>

    <!-- 身份发现 -->
    <div v-if="tab === 'discovery'" class="discovery-panel">
      <div class="panel-header">
        <div class="panel-title">AI 发现的新数字身份</div>
        <el-button size="small" @click="loadNewIdentities">刷新</el-button>
      </div>
      <div class="discovery-list" v-loading="discoveryLoading">
        <div class="discovery-card" v-for="item in newIdentities" :key="item.analysisId">
          <div class="dc-header">
            <div class="dc-icon">
              <Icon icon="mdi:account-plus-outline" width="20" height="20" />
            </div>
            <div class="dc-info">
              <div class="dc-platform">{{ item.sendEmail }}</div>
              <div class="dc-subject">{{ item.subject }}</div>
            </div>
          </div>
          <div class="dc-summary" v-if="item.summary">{{ item.summary }}</div>
          <div class="dc-footer">
            <el-tag size="small">{{ categoryLabel(item.category) }}</el-tag>
            <el-button type="primary" size="small" @click="showConfirm(item)">添加身份</el-button>
            <el-button size="small" @click="ignoreIdentity(item)">忽略</el-button>
          </div>
        </div>
        <div class="empty" v-if="!discoveryLoading && newIdentities.length === 0">
          <Icon icon="mdi:check-circle-outline" width="48" height="48" />
          <div>暂无新身份建议</div>
          <div style="font-size:12px;color:var(--regular-text-color)">AI会在收到新邮件时自动发现身份</div>
        </div>
      </div>
    </div>

    <!-- AI 对话 -->
    <div v-if="tab === 'chat'" class="chat-panel">
      <div class="chat-messages" ref="msgBox">
        <div class="msg-item" v-for="(msg, idx) in messages" :key="idx" :class="msg.role">
          <div class="msg-avatar">
            <Icon :icon="msg.role === 'user' ? 'mdi:account' : 'mdi:robot'" width="20" height="20" />
          </div>
          <div class="msg-content">{{ msg.content }}</div>
        </div>
        <div class="msg-item assistant" v-if="chatLoading">
          <div class="msg-avatar"><Icon icon="mdi:robot" width="20" height="20" /></div>
          <div class="msg-content typing">AI 正在思考...</div>
        </div>
        <div class="empty" v-if="messages.length === 0 && !chatLoading">
          <Icon icon="mdi:robot-outline" width="48" height="48" />
          <div>向 AI 助手提问</div>
          <div style="font-size:12px;color:var(--regular-text-color)">如：我有哪些长期未用的账号？</div>
        </div>
      </div>
      <div class="chat-input">
        <el-input v-model="inputMsg" placeholder="输入问题..." @keyup.enter="sendMsg" />
        <el-button type="primary" @click="sendMsg" :loading="chatLoading">发送</el-button>
      </div>
    </div>

    <!-- 确认身份对话框 -->
    <el-dialog v-model="confirmShow" title="添加数字身份" width="420">
      <el-form :model="confirmForm" label-width="80px">
        <el-form-item label="身份名称">
          <el-input v-model="confirmForm.name" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="confirmForm.category" style="width:100%">
            <el-option label="开发" value="dev" />
            <el-option label="AI工具" value="ai" />
            <el-option label="SaaS" value="saas" />
            <el-option label="云服务" value="cloud" />
            <el-option label="社交" value="social" />
            <el-option label="金融" value="finance" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="用途">
          <el-input v-model="confirmForm.purpose" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="confirmShow = false">取消</el-button>
        <el-button type="primary" @click="confirmIdentity">确认添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, computed} from 'vue'
import {Icon} from '@iconify/vue'
import {ElMessage} from 'element-plus'
import {aiDigestList, aiDigestGenerate, aiNewIdentityList, aiConfirmIdentity, aiChat, aiStatus as aiStatusApi} from '@/request/ai.js'

defineOptions({name: 'assistant'})

const tab = ref('digest')
const digestList = ref([])
const digestLoading = ref(false)
const genLoading = ref(false)
const newIdentities = ref([])
const discoveryLoading = ref(false)
const messages = ref([])
const inputMsg = ref('')
const chatLoading = ref(false)
const msgBox = ref(null)
const confirmShow = ref(false)
const confirmForm = reactive({analysisId: null, name: '', category: 'other', purpose: ''})

// AI 状态：显示当前主用模型 + 是否降级
const aiStatusInfo = ref({
  provider: 0,
  primaryLabel: 'Workers AI (免费)',
  hasWorkersAI: true,
  fallbackEnabled: false,
  fallbackLabel: ''
})
// 最近一次对话返回的降级标记（用于 UI 显示）
const lastChatFallback = ref(false)
const lastChatProviderName = ref('')

const currentAiLabel = computed(() => {
  // 优先显示最近一次对话实际使用的 provider（可能已降级）
  if (lastChatProviderName.value) return lastChatProviderName.value
  return aiStatusInfo.value.primaryLabel || '未配置'
})

const currentAiTagType = computed(() => {
  if (lastChatFallback.value) return 'warning'   // 已降级
  const provider = aiStatusInfo.value.provider
  if (provider === 0) return 'success'           // Workers AI 免费版
  if (provider === 1) return 'primary'           // DeepSeek
  return 'info'                                  // 自定义
})

const currentAiIcon = computed(() => {
  if (lastChatFallback.value) return 'mdi:alert-circle-outline'
  const provider = aiStatusInfo.value.provider
  if (provider === 0) return 'mdi:cloud-braces'
  if (provider === 1) return 'mdi:robot-outline'
  return 'mdi:tune-vertical'
})

const categoryLabels = {
  register: '注册', verify: '验证', security: '安全', bill: '账单',
  update: '更新', marketing: '营销', social: '社交', dev: '开发',
  ai: 'AI工具', saas: 'SaaS', cloud: '云服务', social2: '社交'
}

function categoryLabel(cat) {
  return categoryLabels[cat] || cat || '其他'
}

function formatContent(content) {
  return content.replace(/\n/g, '<br>')
}

async function loadDigest() {
  digestLoading.value = true
  try {
    const res = await aiDigestList({size: 10}).catch(() => null)
    // 拦截器已 resolve(data.data)，res 即摘要列表
    digestList.value = Array.isArray(res) ? res : []
  } finally {
    digestLoading.value = false
  }
}

async function generateToday() {
  genLoading.value = true
  try {
    const res = await aiDigestGenerate().catch(() => null)
    if (res) {
      ElMessage.success('摘要已生成')
      loadDigest()
    }
  } finally {
    genLoading.value = false
  }
}

async function loadNewIdentities() {
  discoveryLoading.value = true
  try {
    const res = await aiNewIdentityList().catch(() => null)
    // 拦截器已 resolve(data.data)，res 即新身份列表
    newIdentities.value = Array.isArray(res) ? res : []
  } finally {
    discoveryLoading.value = false
  }
}

function showConfirm(item) {
  confirmForm.analysisId = item.analysisId
  confirmForm.name = item.emailName || item.sendEmail || ''
  confirmForm.category = item.category || 'other'
  confirmForm.purpose = ''
  confirmShow.value = true
}

async function confirmIdentity() {
  try {
    await aiConfirmIdentity({...confirmForm})
    ElMessage.success('身份已添加')
    confirmShow.value = false
    loadNewIdentities()
  } catch (e) {
    // DEMO_LOCK 由 axios 拦截器处理提示
  }
}

async function ignoreIdentity(item) {
  // 标记为已处理（简化：直接从列表移除，后端可扩展忽略逻辑）
  newIdentities.value = newIdentities.value.filter(i => i.analysisId !== item.analysisId)
  ElMessage.success('已忽略')
}

async function sendMsg() {
  if (!inputMsg.value.trim() || chatLoading.value) return
  const msg = inputMsg.value
  messages.value.push({role: 'user', content: msg})
  inputMsg.value = ''
  chatLoading.value = true
  await nextTick()
  msgBox.value.scrollTop = msgBox.value.scrollHeight
  try {
    const res = await aiChat(msg)
    // 拦截器已 resolve(data.data)，res = {reply, timestamp, provider, providerName, fallback}
    if (res && res.reply) {
      messages.value.push({role: 'assistant', content: res.reply})
      // 更新 UI 显示的 provider 信息（包含降级状态）
      if (res.providerName) {
        lastChatProviderName.value = res.providerName
        lastChatFallback.value = !!res.fallback
        if (res.fallback) {
          ElMessage.warning(`主用 AI 不可用，已自动降级到 ${res.providerName}`)
        }
      }
    } else {
      messages.value.push({role: 'assistant', content: 'AI 返回为空，可能是模型未正确配置。'})
    }
  } catch (e) {
    const reason = e?.message || e?.data?.message || '未知错误'
    messages.value.push({role: 'assistant', content: `AI 服务调用失败：${reason}`})
    console.error('[AI Chat] error:', e)
  } finally {
    chatLoading.value = false
    await nextTick()
    msgBox.value.scrollTop = msgBox.value.scrollHeight
  }
}

async function loadAiStatus() {
  const res = await aiStatusApi().catch(() => null)
  if (res) {
    aiStatusInfo.value = res
    // 状态刷新后，清除上次对话的临时降级标记（按配置显示主用状态）
    lastChatProviderName.value = ''
    lastChatFallback.value = false
  }
}

onMounted(() => {
  loadAiStatus()
  loadDigest()
  loadNewIdentities()
})
</script>

<style lang="scss" scoped>
.assistant-box { padding: 20px; max-width: 900px; margin: 0 auto; }

/* AI 模型状态徽章 */
.ai-model-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.06), rgba(139, 92, 246, 0.04));
  border: 1px solid var(--ci-glass-border, rgba(0, 229, 255, 0.15));
  border-radius: 8px;
  font-size: 13px;
}
.ai-model-info {
  display: flex; align-items: center; gap: 6px;
  color: var(--regular-text-color, #94a3b8);
}
.ai-model-label { color: var(--regular-text-color, #94a3b8); }
.ai-refresh-icon {
  cursor: pointer;
  color: var(--regular-text-color, #94a3b8);
  transition: all 0.2s;
}
.ai-refresh-icon:hover {
  color: var(--ci-cyan, #00e5ff);
  transform: rotate(90deg);
}

.tabs-row {
  display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;
  .tab-item {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 8px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    cursor: pointer; transition: all 0.2s; font-size: 14px;
    &:hover { border-color: var(--el-color-primary); }
    &.active {
      background: var(--el-color-primary); color: #fff; border-color: var(--el-color-primary);
    }
  }
}
.panel-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  .panel-title { font-size: 18px; font-weight: bold; }
}
.digest-list, .discovery-list { min-height: 300px; }
.digest-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px; padding: 16px; margin-bottom: 12px;
  .digest-date {
    display: flex; align-items: center; gap: 6px;
    font-weight: bold; margin-bottom: 10px; font-size: 14px;
  }
  .digest-text { line-height: 1.8; font-size: 14px; white-space: pre-wrap; }
}
.discovery-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px; padding: 14px; margin-bottom: 12px;
  .dc-header { display: flex; gap: 10px; margin-bottom: 8px; }
  .dc-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .dc-info { flex: 1; min-width: 0; }
  .dc-platform { font-weight: bold; font-size: 14px; }
  .dc-subject { font-size: 12px; color: var(--regular-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dc-summary { font-size: 13px; color: var(--regular-text-color); margin: 8px 0; }
  .dc-footer { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
}
.chat-panel {
  display: flex; flex-direction: column; height: calc(100vh - 200px);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px; overflow: hidden;
}
.chat-messages {
  flex: 1; overflow-y: auto; padding: 16px;
  .msg-item {
    display: flex; gap: 10px; margin-bottom: 16px;
    &.user { flex-direction: row-reverse; }
    .msg-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      background: var(--el-fill-color-light);
    }
    &.user .msg-avatar { background: #3b82f6; color: #fff; }
    &.assistant .msg-avatar { background: #8b5cf6; color: #fff; }
    .msg-content {
      max-width: 70%; padding: 10px 14px; border-radius: 10px;
      background: var(--el-fill-color-light); line-height: 1.6; font-size: 14px;
      white-space: pre-wrap;
    }
    &.user .msg-content { background: #3b82f6; color: #fff; }
    .typing { color: var(--regular-text-color); }
  }
}
.chat-input {
  display: flex; gap: 8px; padding: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}
.empty {
  text-align: center; padding: 50px 0; color: var(--regular-text-color);
  div { margin-top: 8px; }
}
</style>
