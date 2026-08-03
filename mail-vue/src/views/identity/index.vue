<template>
  <div class="identity-box">
    <div class="header">
      <div class="header-title">
        <Icon icon="mdi:account-key-outline" width="24" height="24" />
        <span>数字身份中心</span>
      </div>
      <el-button type="primary" @click="showAddDialog">
        <Icon icon="mdi:plus" width="16" height="16" style="margin-right: 4px" />
        添加身份
      </el-button>
    </div>

    <div class="stats-row">
      <div class="stat-card" v-for="item in categoryStats" :key="item.category">
        <div class="stat-icon" :style="{background: categoryColor(item.category)}">
          <Icon :icon="categoryIcon(item.category)" width="20" height="20" />
        </div>
        <div class="stat-info">
          <div class="stat-num">{{ item.total }}</div>
          <div class="stat-label">{{ categoryLabel(item.category) }}</div>
        </div>
      </div>
    </div>

    <div class="filter-row">
      <el-select v-model="filterCategory" placeholder="全部分类" clearable @change="loadList" style="width: 140px">
        <el-option v-for="cat in categories" :key="cat.value" :label="cat.label" :value="cat.value" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="全部状态" clearable @change="loadList" style="width: 140px">
        <el-option label="使用中" :value="0" />
        <el-option label="已停用" :value="1" />
        <el-option label="长期未用" :value="2" />
      </el-select>
      <el-input v-model="keyword" placeholder="搜索身份名称" clearable @input="loadList" style="width: 220px" />
    </div>

    <div class="identity-grid" v-loading="loading">
      <div class="identity-card" v-for="item in list" :key="item.identityId" @click="showDetail(item)">
        <div class="card-header">
          <div class="card-icon" :style="{background: categoryColor(item.category)}">
            <Icon :icon="categoryIcon(item.category)" width="22" height="22" />
          </div>
          <div class="card-title">
            <div class="card-name">{{ item.name }}</div>
            <div class="card-platform">{{ item.platformName || '自定义' }}</div>
          </div>
          <el-tag :type="statusTagType(item.status)" size="small" effect="plain">
            {{ statusLabel(item.status) }}
          </el-tag>
        </div>
        <div class="card-body">
          <div class="card-info">
            <Icon icon="mdi:email-outline" width="14" height="14" />
            <span>{{ item.identityEmail || '未绑定' }}</span>
          </div>
          <div class="card-info" v-if="item.purpose">
            <Icon icon="mdi:text-outline" width="14" height="14" />
            <span class="ellipsis">{{ item.purpose }}</span>
          </div>
          <div class="card-info" v-if="item.lastActiveTime">
            <Icon icon="mdi:clock-outline" width="14" height="14" />
            <span>{{ item.lastActiveTime }}</span>
          </div>
        </div>
        <div class="card-footer">
          <el-tag size="small" :color="categoryColor(item.category)" style="color:#fff;border:none">
            {{ categoryLabel(item.category) }}
          </el-tag>
          <el-dropdown trigger="click" @click.stop>
            <Icon icon="mdi:dots-horizontal" width="18" height="18" style="cursor:pointer" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="showEditDialog(item)">编辑</el-dropdown-item>
                <el-dropdown-item @click="toggleStatus(item)">
                  {{ item.status === 0 ? '标记停用' : '标记启用' }}
                </el-dropdown-item>
                <el-dropdown-item @click="deleteIdentity(item)" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="empty-tip" v-if="!loading && list.length === 0">
        <Icon icon="mdi:account-off-outline" width="48" height="48" />
        <div>暂无数字身份记录</div>
        <div style="font-size:12px;color:var(--regular-text-color)">添加邮箱别名或让AI自动发现身份</div>
      </div>
    </div>

    <el-dialog v-model="dialogShow" :title="editMode ? '编辑身份' : '添加身份'" width="480">
      <el-form :model="form" label-width="90px">
        <el-form-item label="身份名称">
          <el-input v-model="form.name" placeholder="如：GitHub开发身份" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="form.platformId" filterable allow-create default-first-option
                     :reserve-keyword="false" placeholder="选择或输入平台名称" style="width:100%"
                     @change="onPlatformChange">
            <el-option v-for="p in platforms" :key="p.platformId" :label="p.name" :value="p.platformId">
              <span style="float:left">{{ p.logo }} {{ p.name }}</span>
              <span style="float:right;color:var(--regular-text-color);font-size:12px">{{ p.domain }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" style="width:100%">
            <el-option v-for="cat in categories" :key="cat.value" :label="cat.label" :value="cat.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份邮箱">
          <el-input v-model="form.identityEmail" placeholder="github@czlab.dev" />
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker v-model="form.registerTime" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
        <el-form-item label="用途">
          <el-input v-model="form.purpose" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogShow = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveIdentity">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {Icon} from '@iconify/vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {identityList, identityAdd, identityUpdate, identityDelete, identitySetStatus, platformList} from '@/request/identity.js'

defineOptions({name: 'identity'})

const list = ref([])
const platforms = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogShow = ref(false)
const editMode = ref(false)
const filterCategory = ref('')
const filterStatus = ref('')
const keyword = ref('')
const categoryStats = ref([])

const categories = [
  {value: 'dev', label: '开发'},
  {value: 'ai', label: 'AI工具'},
  {value: 'saas', label: 'SaaS'},
  {value: 'cloud', label: '云服务'},
  {value: 'social', label: '社交'},
  {value: 'web3', label: 'Web3'},
  {value: 'finance', label: '金融'},
  {value: 'shop', label: '购物'},
  {value: 'news', label: '资讯'},
  {value: 'other', label: '其他'}
]

const form = reactive({
  identityId: null,
  name: '',
  platformId: 0,
  platformName: '',
  category: 'other',
  identityEmail: '',
  registerTime: '',
  purpose: '',
  remark: ''
})

const categoryColorMap = {
  dev: '#3b82f6', ai: '#8b5cf6', saas: '#06b6d4', cloud: '#f59e0b',
  social: '#ec4899', web3: '#10b981', finance: '#ef4444', shop: '#f97316',
  news: '#6366f1', other: '#64748b'
}

const categoryIconMap = {
  dev: 'mdi:code-braces', ai: 'mdi:robot-outline', saas: 'mdi:cloud-outline',
  cloud: 'mdi:cloud', social: 'mdi:account-group-outline', web3: 'mdi:ethereum',
  finance: 'mdi:finance', shop: 'mdi:shopping-outline', news: 'mdi:newspaper',
  other: 'mdi:dots-horizontal-circle'
}

function categoryColor(cat) {
  return categoryColorMap[cat] || '#64748b'
}
function categoryIcon(cat) {
  return categoryIconMap[cat] || 'mdi:dots-horizontal-circle'
}
function categoryLabel(cat) {
  const item = categories.find(c => c.value === cat)
  return item ? item.label : '其他'
}
function statusLabel(status) {
  return ['使用中', '已停用', '长期未用'][status] || '未知'
}
function statusTagType(status) {
  return ['success', 'info', 'warning'][status] || 'info'
}

async function loadList() {
  loading.value = true
  try {
    const res = await identityList({
      category: filterCategory.value,
      status: filterStatus.value,
      keyword: keyword.value
    }).catch(() => null)
    // 拦截器已 resolve(data.data)，res 即身份列表数组
    list.value = Array.isArray(res) ? res : []
    computeStats()
  } finally {
    loading.value = false
  }
}

function computeStats() {
  const map = {}
  list.value.forEach(item => {
    map[item.category] = (map[item.category] || 0) + 1
  })
  categoryStats.value = Object.entries(map).map(([category, total]) => ({category, total}))
}

async function loadPlatforms() {
  const res = await platformList().catch(() => null)
  // 拦截器已 resolve(data.data)，res 即平台列表数组
  platforms.value = Array.isArray(res) && res.length ? res : []
}

function onPlatformChange(val) {
  // 用户输入了自定义平台名称（allow-create）
  if (typeof val === 'string') {
    const newPlatform = {
      platformId: Date.now(),
      name: val,
      logo: '🔗',
      domain: ''
    }
    platforms.value.push(newPlatform)
    form.platformId = newPlatform.platformId
    form.platformName = val
  } else {
    const p = platforms.value.find(p => p.platformId === val)
    form.platformName = p ? p.name : ''
  }
}

function showAddDialog() {
  editMode.value = false
  Object.assign(form, {
    identityId: null, name: '', platformId: 0, platformName: '', category: 'other',
    identityEmail: '', registerTime: '', purpose: '', remark: ''
  })
  dialogShow.value = true
}

function showEditDialog(item) {
  editMode.value = true
  Object.assign(form, {
    identityId: item.identityId, name: item.name, platformId: item.platformId,
    category: item.category, identityEmail: item.identityEmail,
    registerTime: item.registerTime, purpose: item.purpose, remark: item.remark
  })
  dialogShow.value = true
}

async function saveIdentity() {
  if (!form.name) {
    ElMessage.warning('请输入身份名称')
    return
  }
  saving.value = true
  try {
    if (editMode.value) {
      await identityUpdate({...form})
    } else {
      await identityAdd({...form})
    }
    ElMessage.success('保存成功')
    dialogShow.value = false
    loadList()
  } catch (e) {
    // DEMO_LOCK 由 axios 拦截器处理提示
  } finally {
    saving.value = false
  }
}

async function deleteIdentity(item) {
  await ElMessageBox.confirm(`确定删除身份「${item.name}」吗？`, '提示', {type: 'warning'})
  try {
    await identityDelete(item.identityId)
    ElMessage.success('已删除')
    loadList()
  } catch (e) {}
}

async function toggleStatus(item) {
  const newStatus = item.status === 0 ? 1 : 0
  try {
    await identitySetStatus(item.identityId, newStatus)
    ElMessage.success('状态已更新')
    loadList()
  } catch (e) {}
}

function showDetail(item) {
  // 简单展示，可扩展为详情页
}

onMounted(() => {
  loadList()
  loadPlatforms()
})
</script>

<style lang="scss" scoped>
.identity-box {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: bold;
  }
}
.stats-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 120px;
  .stat-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  .stat-num { font-size: 20px; font-weight: bold; }
  .stat-label { font-size: 12px; color: var(--regular-text-color); }
}
.filter-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.identity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  min-height: 200px;
}
.identity-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    .card-icon {
      width: 40px; height: 40px;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0;
    }
    .card-title { flex: 1; min-width: 0; }
    .card-name { font-weight: bold; font-size: 15px; }
    .card-platform { font-size: 12px; color: var(--regular-text-color); }
  }
  .card-body {
    .card-info {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--regular-text-color);
      margin-bottom: 6px;
      .ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
  }
  .card-footer {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 12px; padding-top: 10px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
.empty-tip {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
  color: var(--regular-text-color);
  div { margin-top: 8px; }
}
</style>
