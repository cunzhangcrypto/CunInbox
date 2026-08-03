<template>
  <div class="dashboard-box">
    <!-- 顶部欢迎条 -->
    <div class="ci-welcome ci-shimmer-auto">
      <div class="ci-welcome__left">
        <div class="ci-welcome__title">
          <span class="ci-welcome__hash">#</span>
          <span>CUNINBOX_CONTROL_PANEL</span>
          <span class="ci-welcome__v">v2.0 · Deep Cyan</span>
        </div>
        <div class="ci-welcome__sub">
          <Icon icon="mdi:speedometer" width="14" height="14"/>
          <span>SYSTEM ONLINE · AI CORE READY · IDENTITY MATRIX ACTIVE</span>
        </div>
      </div>
      <div class="ci-welcome__right">
        <div class="ci-clock">
          <span class="ci-clock__date">{{ dateStr }}</span>
          <span class="ci-clock__time">{{ timeStr }}</span>
        </div>
      </div>
    </div>

    <!-- 4 张 HUD 风 KPI 卡片 -->
    <div class="overview-row">
      <div class="overview-card ci-hud-card ci-shimmer-wrap"
           :style="{'--hud-color': '#3d7cff', '--hud-glow': 'rgba(61, 124, 255, .35)'}">
        <div class="ov-hud-corner ov-hud-corner--tl"></div>
        <div class="ov-hud-corner ov-hud-corner--br"></div>
        <div class="ov-icon">
          <Icon icon="mdi:account-key-outline" width="22" height="22" />
        </div>
        <div class="ov-info">
          <div class="ov-num">{{ identityCount }}</div>
          <div class="ov-label">IDENTITY / 数字身份</div>
          <div class="ov-bar"><i :style="{width: Math.min(identityCount*8, 100) + '%'}"></i></div>
        </div>
      </div>

      <div class="overview-card ci-hud-card ci-shimmer-wrap"
           :style="{'--hud-color': '#22d39a', '--hud-glow': 'rgba(34, 211, 154, .35)'}">
        <div class="ov-hud-corner ov-hud-corner--tl"></div>
        <div class="ov-hud-corner ov-hud-corner--br"></div>
        <div class="ov-icon" style="background: rgba(34,211,154,.15); color:#22d39a">
          <Icon icon="mdi:email-outline" width="22" height="22" />
        </div>
        <div class="ov-info">
          <div class="ov-num">{{ emailCount }}</div>
          <div class="ov-label">ANALYZED / 邮件分析</div>
          <div class="ov-bar ov-bar--green"><i :style="{width: Math.min(emailCount*2, 100) + '%'}"></i></div>
        </div>
      </div>

      <div class="overview-card ci-hud-card ci-shimmer-wrap"
           :style="{'--hud-color': securityStats.highRisk > 0 ? '#ff4d6d' : '#22d39a',
                    '--hud-glow': securityStats.highRisk > 0 ? 'rgba(255,77,109,.35)' : 'rgba(34,211,154,.35)'}">
        <div class="ov-hud-corner ov-hud-corner--tl"></div>
        <div class="ov-hud-corner ov-hud-corner--br"></div>
        <div class="ov-icon" :style="securityStats.highRisk > 0
              ? {background: 'rgba(255,77,109,.15)', color:'#ff4d6d'}
              : {background: 'rgba(34,211,154,.15)', color:'#22d39a'}">
          <Icon icon="mdi:shield-alert-outline" width="22" height="22" />
        </div>
        <div class="ov-info">
          <div class="ov-num">{{ securityStats.highRisk }}</div>
          <div class="ov-label">RISK / 高危事件</div>
          <div class="ov-bar ov-bar--red"><i :style="{width: Math.min(securityStats.highRisk*20, 100) + '%'}"></i></div>
        </div>
      </div>

      <div class="overview-card ci-hud-card ci-shimmer-wrap"
           :style="{'--hud-color': '#fbbf24', '--hud-glow': 'rgba(251, 191, 36, .35)'}">
        <div class="ov-hud-corner ov-hud-corner--tl"></div>
        <div class="ov-hud-corner ov-hud-corner--br"></div>
        <div class="ov-icon" style="background: rgba(251,191,36,.15); color:#fbbf24">
          <Icon icon="mdi:lightbulb-on-outline" width="22" height="22" />
        </div>
        <div class="ov-info">
          <div class="ov-num">{{ newIdentityCount }}</div>
          <div class="ov-label">SUGGEST / 新身份建议</div>
          <div class="ov-bar ov-bar--amber"><i :style="{width: Math.min(newIdentityCount*15, 100) + '%'}"></i></div>
        </div>
      </div>
    </div>

    <div class="main-row">
      <!-- Terminal 风 AI 摘要 -->
      <div class="digest-section ci-terminal ci-shimmer-auto">
        <div class="ci-terminal-titlebar digest-titlebar">
          <span class="dot" style="background:#ff5f57"></span>
          <span class="dot" style="background:#febc2e"></span>
          <span class="dot" style="background:#28c840"></span>
          <span class="ci-terminal-title">ai-digest.sh · CunInbox AI Summary</span>
          <el-button text @click="generateDigest" :loading="digestLoading" class="digest-btn">
            <Icon icon="mdi:refresh" width="14" height="14"/>刷新
          </el-button>
        </div>
        <div class="digest-content" v-loading="digestLoading">
          <div v-if="todayDigest" class="digest-text">
            <div class="term-line"><span class="term-prompt">$</span> ai --daily-digest --mode=deep</div>
            <div class="term-line term-ok"><span class="term-tag">[OK]</span> Analysis engine initialized</div>
            <div class="term-line term-ok"><span class="term-tag">[OK]</span> Identity matrix scanned</div>
            <div class="term-line term-output" v-html="formatDigest(todayDigest.content)"></div>
            <div class="term-line"><span class="term-prompt">$</span> <span class="term-cursor">_</span></div>
          </div>
          <div v-else class="digest-empty">
            <div class="term-line"><span class="term-prompt">$</span> ai --daily-digest</div>
            <div class="term-line term-warn"><span class="term-tag">[WARN]</span> No digest cached yet</div>
            <div class="term-line">&nbsp;</div>
            <el-button type="primary" size="small" @click="generateDigest">
              <Icon icon="mdi:flash" width="14" height="14" style="margin-right:4px"/>
              Run generate
            </el-button>
          </div>
        </div>
      </div>

      <!-- 邮件分类面板 -->
      <div class="side-section ci-hud-panel ci-shimmer-wrap">
        <div class="section-header">
          <div class="section-title">
            <Icon icon="mdi:chart-donut" width="18" height="18" />
            <span>CATEGORY_MATRIX / 分类</span>
          </div>
        </div>
        <div class="category-list">
          <div class="cat-item" v-for="item in analysisStats" :key="item.category">
            <div class="cat-dot" :style="{background: categoryColor(item.category),
                                            boxShadow: '0 0 8px ' + categoryColor(item.category)}"></div>
            <span class="cat-name">{{ categoryLabel(item.category) }}</span>
            <span class="cat-num">{{ item.total }}</span>
            <div class="cat-bar"><i :style="{width: Math.min(item.total * 6, 100) + '%', background: categoryColor(item.category)}"></i></div>
          </div>
          <div class="cat-empty" v-if="analysisStats.length === 0">暂无分析数据</div>
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <!-- 新身份建议 -->
      <div class="new-identity-section ci-hud-panel ci-shimmer-wrap">
        <div class="section-header">
          <div class="section-title">
            <Icon icon="mdi:lightbulb-on-outline" width="18" height="18" />
            <span>NEW_IDENTITY / AI 发现</span>
          </div>
          <el-button text type="primary" @click="$router.push('/assistant')">查看全部 →</el-button>
        </div>
        <div class="new-identity-list">
          <div class="ni-item" v-for="item in newIdentities.slice(0,5)" :key="item.analysisId">
            <div class="ni-icon">
              <Icon icon="mdi:account-plus-outline" width="16" height="16" />
            </div>
            <div class="ni-info">
              <div class="ni-name">{{ item.sendEmail }}</div>
              <div class="ni-subject">{{ item.subject }}</div>
            </div>
            <span class="ni-tag">NEW</span>
          </div>
          <div class="cat-empty" v-if="newIdentities.length === 0">暂无新身份建议</div>
        </div>
      </div>

      <!-- 安全状态 -->
      <div class="security-section ci-hud-panel ci-shimmer-wrap">
        <div class="section-header">
          <div class="section-title">
            <Icon icon="mdi:shield-check-outline" width="18" height="18" />
            <span>SECURITY_CENTER / 安全</span>
          </div>
          <el-button text type="primary" @click="$router.push('/security')">查看全部 →</el-button>
        </div>
        <div class="security-status">
          <div class="sec-stat ci-hud-card-mini"
               :style="{'--hud-color': securityStats.highRisk > 0 ? '#ff4d6d' : '#22d39a'}">
            <div class="sec-num" :style="{color: securityStats.highRisk > 0 ? '#ff4d6d' : '#22d39a'}">
              {{ securityStats.highRisk }}
            </div>
            <div class="sec-label">HIGH / 高危</div>
          </div>
          <div class="sec-stat ci-hud-card-mini" :style="{'--hud-color': '#fbbf24'}">
            <div class="sec-num">{{ securityStats.unprocessed }}</div>
            <div class="sec-label">PENDING / 待处理</div>
          </div>
          <div class="sec-stat ci-hud-card-mini" :style="{'--hud-color': '#3d7cff'}">
            <div class="sec-num">{{ securityStats.total }}</div>
            <div class="sec-label">TOTAL / 总计</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {Icon} from '@iconify/vue'
import {ElMessage} from 'element-plus'
import dayjs from 'dayjs'
import {identityList} from '@/request/identity.js'
import {aiAnalysisStats, aiNewIdentityList, aiDigestGenerate, aiDigestList} from '@/request/ai.js'
import {securityStats as securityStatsApi} from '@/request/security.js'

defineOptions({name: 'dashboard'})

const identityCount = ref(0)
const emailCount = ref(0)
const newIdentityCount = ref(0)
const analysisStats = ref([])
const newIdentities = ref([])
const todayDigest = ref('')
const digestLoading = ref(false)
const securityStats = ref({total: 0, unprocessed: 0, highRisk: 0})

// 右上角 HUD 时钟
const dateStr = ref('')
const timeStr = ref('')
let clockTimer = null
function tickClock() {
  const now = dayjs()
  dateStr.value = now.format('YYYY-MM-DD ddd').toUpperCase()
  timeStr.value = now.format('HH:mm:ss')
}
tickClock()

const categoryColorMap = {
  register: '#3b82f6', verify: '#06b6d4', security: '#ef4444', bill: '#f59e0b',
  update: '#8b5cf6', marketing: '#64748b', social: '#ec4899',
  dev: '#3b82f6', newsletter: '#6366f1', ai: '#8b5cf6', other: '#64748b'
}
const categoryLabels = {
  register: '注册', verify: '验证', security: '安全', bill: '账单',
  update: '更新', marketing: '营销', social: '社交',
  dev: '开发', newsletter: '资讯', ai: 'AI', other: '其他'
}

function categoryColor(cat) {
  return categoryColorMap[cat] || '#64748b'
}
function categoryLabel(cat) {
  return categoryLabels[cat] || cat || '其他'
}

function formatDigest(content) {
  return content.replace(/\n/g, '<br>')
}

// Mock 数据已迁移至 src/demo/data.js（演示模式集中管理）

async function loadData() {
  try {
    const [idRes, statsRes, newIdRes, secRes, digestRes] = await Promise.all([
      identityList({}).catch(() => null),
      aiAnalysisStats().catch(() => null),
      aiNewIdentityList().catch(() => null),
      securityStatsApi().catch(() => null),
      aiDigestList({size: 1}).catch(() => null),
    ])
    // 拦截器已 resolve(data.data)，res 即实际数据
    identityCount.value = Array.isArray(idRes) ? idRes.length : 0
    analysisStats.value = Array.isArray(statsRes) ? statsRes : []
    emailCount.value = analysisStats.value.reduce((sum, item) => sum + (item.total || 0), 0)
    newIdentities.value = Array.isArray(newIdRes) ? newIdRes : []
    newIdentityCount.value = newIdentities.value.length
    securityStats.value = secRes || {total: 0, unprocessed: 0, highRisk: 0}
    if (Array.isArray(digestRes) && digestRes.length > 0) {
      todayDigest.value = digestRes[0]
    } else {
      todayDigest.value = null
    }
  } catch (e) {
    console.error('loadData error:', e)
  }
}

async function generateDigest() {
  digestLoading.value = true
  try {
    const res = await aiDigestGenerate().catch(() => null)
    if (res) {
      todayDigest.value = res
      ElMessage.success('摘要已生成')
    }
  } finally {
    digestLoading.value = false
  }
}

onMounted(() => {
  loadData()
  clockTimer = setInterval(tickClock, 1000)
})
onBeforeUnmount(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<style lang="scss" scoped>

.dashboard-box {
  padding: 22px 26px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ========== 顶部 HUD 欢迎条 ========== */
.ci-welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px;
  margin-bottom: 22px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(0,229,255,0.07), rgba(139,92,246,0.07));
  border: 1px solid rgba(0,229,255,0.18);
  position: relative;
  &__left { display: flex; flex-direction: column; gap: 5px; }
  &__title {
    display: flex; align-items: center; gap: 8px;
    font-size: 16px;
    font-weight: 700;
    color: var(--ci-text-1);
    letter-spacing: 1px;
    font-family: var(--ci-font-mono);
  }
  &__hash {
    color: var(--ci-cyan);
    font-weight: 800;
    text-shadow: 0 0 6px rgba(0,229,255,.5);
  }
  &__v {
    margin-left: 4px;
    padding: 2px 8px;
    font-size: 10.5px;
    color: var(--ci-purple);
    border-radius: 4px;
    background: rgba(139,92,246,.12);
    border: 1px solid rgba(139,92,246,.3);
    letter-spacing: .5px;
    font-weight: 600;
  }
  &__sub {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--ci-text-2);
    letter-spacing: 1.2px;
    font-family: var(--ci-font-mono);
    opacity: .9;
  }
  &__sub svg { color: var(--ci-cyan); }
}

/* HUD 时钟 */
.ci-clock {
  display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
  font-family: var(--ci-font-mono);
  &__date {
    font-size: 10.5px;
    letter-spacing: 1.5px;
    color: var(--ci-text-3);
    font-weight: 500;
  }
  &__time {
    font-size: 22px;
    font-weight: 700;
    color: var(--ci-cyan);
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(0,229,255,.4);
  }
}

/* ========== HUD 风 4 张 KPI 卡片 ========== */
.overview-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.ci-hud-card {
  --hud-color: var(--ci-cyan);
  --hud-glow: rgba(0,229,255,.35);
  position: relative;
  display: flex; align-items: center; gap: 14px;
  background: var(--ci-bg-panel);
  border: 1px solid var(--hud-color);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,.02) inset,
    0 0 20px var(--hud-glow),
    0 8px 24px rgba(0,0,0,.35);
  transition: transform .25s ease, box-shadow .25s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,.03) inset,
      0 0 32px var(--hud-glow),
      0 12px 32px rgba(0,0,0,.45);
  }
}

/* HUD 四角装饰 */
.ov-hud-corner {
  position: absolute;
  width: 10px; height: 10px;
  border-color: var(--hud-color);
  border-style: solid;
  opacity: .9;
  pointer-events: none;
  &--tl { top: 6px; left: 6px; border-width: 1.5px 0 0 1.5px; }
  &--br { bottom: 6px; right: 6px; border-width: 0 1.5px 1.5px 0; }
}

.overview-card {
  .ov-icon {
    width: 46px; height: 46px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(61, 124, 255, .15);
    color: var(--hud-color);
    border: 1px solid var(--hud-color);
    box-shadow: 0 0 12px var(--hud-glow) inset;
    flex-shrink: 0;
  }
  .ov-info { flex: 1; min-width: 0; }
  .ov-num {
    font-size: 28px;
    font-weight: 800;
    color: var(--hud-color);
    letter-spacing: .5px;
    line-height: 1;
    text-shadow: 0 0 10px var(--hud-glow);
    font-family: var(--ci-font-mono);
  }
  .ov-label {
    font-size: 11px;
    color: var(--ci-text-2);
    margin-top: 6px;
    letter-spacing: 1px;
    font-family: var(--ci-font-mono);
    opacity: .85;
  }
  /* HUD 进度条 */
  .ov-bar {
    margin-top: 10px;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,.05);
    overflow: hidden;
    i {
      display: block;
      height: 100%;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--hud-color), var(--ci-purple));
      box-shadow: 0 0 8px var(--hud-glow);
    }
  }
}

/* ========== 主内容区 布局 ========== */
.main-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 22px;
}

/* ========== Terminal 风 AI 摘要 ========== */
.digest-section { min-height: 360px; }

.digest-titlebar {
  .ci-terminal-title {
    margin-left: 10px;
    flex: 1;
    color: var(--ci-text-2);
  }
  .digest-btn {
    margin-left: auto;
    color: var(--ci-cyan);
    font-size: 12px;
    &:hover { text-shadow: 0 0 6px rgba(0,229,255,.5); }
  }
}

.digest-content {
  padding: 14px 18px 18px;
  min-height: 300px;
}

.digest-text {
  display: flex; flex-direction: column; gap: 4px;
  line-height: 1.7;
  font-size: 13px;
  color: var(--ci-text-1);
}

/* Terminal 行 */
.term-line {
  font-family: var(--ci-font-mono);
  font-size: 12.5px;
  padding: 2px 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.75;
}
.term-prompt {
  color: var(--ci-green);
  font-weight: 700;
  flex-shrink: 0;
}
.term-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .5px;
  margin-right: 4px;
  flex-shrink: 0;
}
.term-ok .term-tag {
  background: rgba(34,211,154,.15);
  color: var(--ci-green);
  border: 1px solid rgba(34,211,154,.3);
}
.term-warn .term-tag {
  background: rgba(251,191,36,.15);
  color: var(--ci-amber);
  border: 1px solid rgba(251,191,36,.3);
}
.term-output {
  color: var(--ci-text-1);
  padding: 6px 0 6px 14px;
  margin: 4px 0;
  border-left: 2px solid var(--ci-cyan);
  background: linear-gradient(90deg, rgba(0,229,255,.05), transparent);
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.8;
  letter-spacing: .2px;
  /* 模拟光标输出效果 */
  animation: ci-fade-in .4s ease both;
}
@keyframes ci-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 终端闪烁光标 */
.term-cursor {
  display: inline-block;
  width: 8px; height: 16px;
  background: var(--ci-cyan);
  box-shadow: 0 0 6px rgba(0,229,255,.6);
  animation: ci-typing-cursor 1.1s steps(1) infinite;
  align-self: center;
  margin-left: 2px;
}

.digest-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; padding: 40px 0;
  font-family: var(--ci-font-mono);
  font-size: 12.5px;
  .el-button { margin-top: 8px; }
}

/* ========== HUD 面板（分类/新身份/安全） ========== */
.ci-hud-panel {
  position: relative;
  background: var(--ci-bg-panel);
  border: 1px solid var(--ci-border-strong);
  border-radius: 12px;
  padding: 16px 18px;
  overflow: hidden;
  transition: border-color .2s ease;
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--ci-cyan), var(--ci-purple), transparent);
    opacity: .6;
  }
  &:hover { border-color: rgba(0,229,255,.4); }
}

.section-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 14px;
  .section-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: var(--ci-text-1);
    letter-spacing: 1.2px;
    font-family: var(--ci-font-mono);
    svg { color: var(--ci-cyan); filter: drop-shadow(0 0 3px rgba(0,229,255,.4)); }
  }
}

/* ========== 分类列表 ========== */
.category-list {
  display: flex; flex-direction: column; gap: 2px;
  .cat-item {
    display: grid;
    grid-template-columns: 16px 1fr auto;
    grid-template-rows: auto auto;
    gap: 4px 10px;
    align-items: center;
    padding: 9px 4px;
    border-bottom: 1px dashed var(--ci-border);
    &:last-child { border-bottom: 0; }
  }
  .cat-dot {
    grid-column: 1; grid-row: 1 / span 2;
    width: 8px; height: 8px;
    border-radius: 50%;
    align-self: center;
  }
  .cat-name {
    grid-column: 2; grid-row: 1;
    font-size: 13px;
    color: var(--ci-text-1);
    font-weight: 500;
  }
  .cat-num {
    grid-column: 3; grid-row: 1 / span 2;
    font-weight: 700;
    font-family: var(--ci-font-mono);
    font-size: 15px;
    color: var(--ci-text-1);
  }
  .cat-bar {
    grid-column: 2; grid-row: 2;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,.05);
    overflow: hidden;
    i {
      display: block; height: 100%;
      border-radius: 2px;
      opacity: .85;
      box-shadow: 0 0 6px currentColor;
    }
  }
  .cat-empty {
    text-align: center; color: var(--ci-text-3);
    padding: 28px 0; font-size: 12.5px;
    font-family: var(--ci-font-mono);
  }
}

/* ========== 底部两栏 ========== */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* 新身份列表 */
.new-identity-list {
  display: flex; flex-direction: column;
  .ni-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 4px;
    border-bottom: 1px dashed var(--ci-border);
    position: relative;
    transition: background .2s ease;
    &:last-child { border-bottom: 0; }
    &:hover { background: rgba(0,229,255,.03); }
  }
  .ni-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: rgba(139,92,246,.12);
    color: var(--ci-purple);
    border: 1px solid rgba(139,92,246,.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ni-info { flex: 1; min-width: 0; }
  .ni-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--ci-text-1);
    font-family: var(--ci-font-mono);
  }
  .ni-subject {
    font-size: 12px;
    color: var(--ci-text-3);
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ni-tag {
    flex-shrink: 0;
    padding: 2px 7px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--ci-cyan);
    background: rgba(0,229,255,.1);
    border: 1px solid rgba(0,229,255,.3);
    border-radius: 4px;
    font-family: var(--ci-font-mono);
  }
}

/* 安全状态 */
.security-status {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
}

.ci-hud-card-mini {
  --hud-color: var(--ci-cyan);
  flex: 1;
  text-align: center;
  padding: 16px 10px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,.02), transparent);
  border: 1px solid var(--hud-color);
  box-shadow: 0 0 12px color-mix(in srgb, var(--hud-color) 25%, transparent);
  transition: transform .2s ease;
  &:hover { transform: translateY(-2px); }
}

.sec-stat {
  .sec-num {
    font-size: 30px;
    font-weight: 800;
    font-family: var(--ci-font-mono);
    line-height: 1;
    text-shadow: 0 0 10px color-mix(in srgb, var(--hud-color) 50%, transparent);
    color: var(--hud-color);
  }
  .sec-label {
    margin-top: 8px;
    font-size: 10.5px;
    letter-spacing: 1px;
    color: var(--ci-text-2);
    font-family: var(--ci-font-mono);
    opacity: .9;
  }
}

.cat-empty {
  text-align: center;
  color: var(--ci-text-3);
  padding: 28px 0;
  font-size: 12.5px;
  font-family: var(--ci-font-mono);
}

/* ========== 响应式 ========== */
@media (max-width: 960px) {
  .dashboard-box { padding: 16px; }
  .overview-row { grid-template-columns: repeat(2, 1fr); }
  .main-row, .bottom-row { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .overview-row { grid-template-columns: 1fr; }
  .ci-welcome {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  .ci-clock { align-items: flex-start; }
  .security-status { flex-direction: column; }
}
</style>
