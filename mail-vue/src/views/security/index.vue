<template>
  <div class="security-box">
    <div class="header">
      <div class="header-title">
        <Icon icon="mdi:shield-check-outline" width="24" height="24" />
        <span>安全中心</span>
      </div>
      <div class="risk-overview">
        <div class="risk-card" :class="stats.highRisk > 0 ? 'danger' : 'safe'">
          <div class="risk-icon">
            <Icon :icon="stats.highRisk > 0 ? 'mdi:alert-circle' : 'mdi:shield-check'" width="22" height="22" />
          </div>
          <div class="risk-info">
            <div class="risk-label">当前风险</div>
            <div class="risk-level">{{ stats.highRisk > 0 ? '需关注' : '安全' }}</div>
          </div>
        </div>
        <div class="stat-mini">
          <div class="mini-num">{{ stats.unprocessed }}</div>
          <div class="mini-label">待处理</div>
        </div>
        <div class="stat-mini">
          <div class="mini-num">{{ stats.total }}</div>
          <div class="mini-label">总计</div>
        </div>
      </div>
    </div>

    <div class="filter-row">
      <el-select v-model="filterRisk" placeholder="全部风险" clearable @change="loadList" style="width:130px">
        <el-option label="低风险" :value="0" />
        <el-option label="中风险" :value="1" />
        <el-option label="高风险" :value="2" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="全部状态" clearable @change="loadList" style="width:130px">
        <el-option label="未处理" :value="0" />
        <el-option label="已确认" :value="1" />
        <el-option label="已忽略" :value="2" />
        <el-option label="已处理" :value="3" />
      </el-select>
    </div>

    <div class="event-list" v-loading="loading">
      <div class="event-card" v-for="item in list" :key="item.eventId">
        <div class="event-left">
          <div class="event-icon" :style="{background: riskColor(item.riskLevel)}">
            <Icon :icon="typeIcon(item.type)" width="20" height="20" />
          </div>
        </div>
        <div class="event-main">
          <div class="event-title-row">
            <span class="event-title">{{ item.title }}</span>
            <el-tag :type="riskTagType(item.riskLevel)" size="small" effect="dark">
              {{ riskLabel(item.riskLevel) }}
            </el-tag>
          </div>
          <div class="event-desc">{{ item.description }}</div>
          <div class="event-suggestion" v-if="item.suggestion">
            <Icon icon="mdi:lightbulb-on-outline" width="14" height="14" />
            <span>{{ item.suggestion }}</span>
          </div>
          <div class="event-meta">
            <span>{{ typeLabel(item.type) }}</span>
            <span>{{ formatTime(item.createTime) }}</span>
          </div>
        </div>
        <div class="event-actions" v-if="item.status === 0">
          <el-button size="small" type="primary" @click="setStatus(item, 3)">已处理</el-button>
          <el-button size="small" @click="setStatus(item, 2)">忽略</el-button>
        </div>
        <div class="event-actions" v-else>
          <el-tag size="small" :type="statusTagType(item.status)">{{ statusLabel(item.status) }}</el-tag>
        </div>
      </div>
      <div class="empty" v-if="!loading && list.length === 0">
        <Icon icon="mdi:shield-check-outline" width="48" height="48" />
        <div>暂无安全事件</div>
        <div style="font-size:12px;color:var(--regular-text-color)">AI会自动检测密码变更、异常登录、钓鱼邮件等</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {Icon} from '@iconify/vue'
import {ElMessage} from 'element-plus'
import {securityList, securityStats, securitySetStatus} from '@/request/security.js'

defineOptions({name: 'security'})

const list = ref([])
const loading = ref(false)
const filterRisk = ref('')
const filterStatus = ref('')
const stats = ref({total: 0, unprocessed: 0, highRisk: 0})

const typeIcons = {
  password_change: 'mdi:lock-reset',
  abnormal_login: 'mdi:login',
  phishing: 'mdi:fish',
  suspicious: 'mdi:alert',
  data_breach: 'mdi:database-alert'
}
const typeLabels = {
  password_change: '密码变更',
  abnormal_login: '异常登录',
  phishing: '钓鱼邮件',
  suspicious: '可疑邮件',
  data_breach: '数据泄露'
}

function typeIcon(type) { return typeIcons[type] || 'mdi:alert' }
function typeLabel(type) { return typeLabels[type] || type }
function riskColor(level) { return ['#10b981', '#f59e0b', '#ef4444'][level] || '#64748b' }
function riskLabel(level) { return ['低风险', '中风险', '高风险'][level] || '未知' }
function riskTagType(level) { return ['success', 'warning', 'danger'][level] || 'info' }
function statusLabel(status) { return ['未处理', '已确认', '已忽略', '已处理'][status] || '未知' }
function statusTagType(status) { return ['info', 'primary', 'info', 'success'][status] || 'info' }
function formatTime(t) {
  if (!t) return ''
  const d = new Date(t)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function loadStats() {
  const res = await securityStats().catch(() => null)
  stats.value = res || {total: 0, unprocessed: 0, highRisk: 0}
}

async function loadList() {
  loading.value = true
  try {
    const res = await securityList({
      riskLevel: filterRisk.value,
      status: filterStatus.value,
      size: 30
    }).catch(() => null)
    // 拦截器已 resolve(data.data)，res 即安全事件列表
    list.value = Array.isArray(res) ? res : []
  } finally {
    loading.value = false
  }
}

async function setStatus(item, status) {
  try {
    await securitySetStatus(item.eventId, status)
    ElMessage.success('已更新')
    loadList()
    loadStats()
  } catch (e) {}
}

onMounted(() => {
  loadStats()
  loadList()
})
</script>

<style lang="scss" scoped>
.security-box { padding: 20px; max-width: 1000px; margin: 0 auto; }
.header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 20px; flex-wrap: wrap; gap: 16px;
  .header-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 20px; font-weight: bold;
  }
}
.risk-overview { display: flex; gap: 12px; align-items: center; }
.risk-card {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px; border-radius: 10px;
  .risk-icon {
    width: 40px; height: 40px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; color: #fff;
  }
  .risk-label { font-size: 12px; color: var(--regular-text-color); }
  .risk-level { font-size: 18px; font-weight: bold; }
  &.danger {
    background: #fef2f2; border: 1px solid #fecaca;
    .risk-icon { background: #ef4444; }
    .risk-level { color: #ef4444; }
  }
  &.safe {
    background: #f0fdf4; border: 1px solid #bbf7d0;
    .risk-icon { background: #10b981; }
    .risk-level { color: #10b981; }
  }
}
.stat-mini {
  text-align: center; padding: 8px 16px;
  background: var(--el-bg-color); border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  .mini-num { font-size: 20px; font-weight: bold; }
  .mini-label { font-size: 12px; color: var(--regular-text-color); }
}
.filter-row {
  display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
}
.event-list { min-height: 300px; }
.event-card {
  display: flex; gap: 14px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px; padding: 16px; margin-bottom: 12px;
  .event-left { flex-shrink: 0; }
  .event-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; color: #fff;
  }
  .event-main { flex: 1; min-width: 0; }
  .event-title-row {
    display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
    .event-title { font-weight: bold; font-size: 15px; }
  }
  .event-desc { font-size: 13px; color: var(--el-text-color-primary); margin-bottom: 8px; }
  .event-suggestion {
    display: flex; align-items: flex-start; gap: 6px;
    font-size: 13px; color: #f59e0b;
    background: #fffbeb; padding: 8px 10px; border-radius: 6px; margin-bottom: 8px;
  }
  .event-meta {
    display: flex; gap: 12px; font-size: 12px; color: var(--regular-text-color);
  }
  .event-actions {
    display: flex; flex-direction: column; gap: 6px; justify-content: center;
  }
}
.empty {
  text-align: center; padding: 60px 0; color: var(--regular-text-color);
  div { margin-top: 8px; }
}
</style>
