/**
 * CunInbox 演示模式控制器
 * 拦截所有 API 请求，已覆盖的返回 mock 数据，未覆盖的返回 DEMO_LOCK
 *
 * 数据格式统一遵循后端 API 规范：{ code: 200, data: ..., message: '' }
 * 这样子页面的 res.data 读取逻辑无需任何改动即可正常工作
 */
import * as data from './data.js'

const DEMO_LOCK = { code: 'DEMO_LOCK', message: '此为演示版本，该功能请正式部署后使用' }

/** 包装成后端标准响应 */
function ok(d) { return { code: 200, data: d, message: '' } }

/**
 * 根据请求 URL + method 匹配 mock 数据
 * @returns {Promise<{code,data,message}>} resolve(标准响应) 或 reject(DEMO_LOCK)
 */
export function handleDemoRequest(config) {
  const url = (config.url || '').replace(/^\//, '')
  const method = (config.method || 'get').toLowerCase()
  const params = config.params || {}
  const body = config.data || {}

  return new Promise((resolve, reject) => {
    // 模拟极短延迟（让 UI 有 loading 过渡感）
    setTimeout(() => {

      // ========== 设置 ==========
      if (url === 'setting/websiteConfig') return resolve(ok(data.websiteConfig))

      // ========== 用户 ==========
      if (url === 'my/loginUserInfo') return resolve(ok(data.userInfo))
      if (url === 'my/resetPassword' || url === 'my/delete') return reject(DEMO_LOCK)

      // ========== 登录 / 注册 / 登出 ==========
      if (url === 'login') return resolve(ok({ token: 'demo-token-' + Date.now() }))
      if (url === 'logout') return resolve(ok(null))
      if (url === 'register') return reject(DEMO_LOCK)

      // ========== 平台 ==========
      if (url === 'platform/list') return resolve(ok(data.platforms))
      if (url === 'platform/add' || url === 'platform/update') return reject(DEMO_LOCK)

      // ========== 数字身份 ==========
      if (url === 'identity/list') return resolve(ok(data.identityList))
      if (url === 'identity/stats') return resolve(ok(computeIdentityStats()))
      if (url === 'identity/detail') {
        const item = data.identityList.find(i => i.identityId === params.identityId)
        return resolve(ok(item || null))
      }
      // 写操作 → 演示锁
      if (['identity/add', 'identity/update', 'identity/delete', 'identity/setStatus'].includes(url)) {
        return reject(DEMO_LOCK)
      }

      // ========== AI 分析 ==========
      if (url === 'ai/status') return resolve(ok(data.aiStatusInfo))
      if (url === 'ai/analysis/stats') {
        // dashboard 期望 [{category, total}] 数组
        return resolve(ok(data.aiStats.categories.map(c => ({category: c.category, total: c.count}))))
      }
      if (url === 'ai/analysis/list') return resolve(ok(data.aiAnalysisList))
      if (url === 'ai/analysis/newIdentity') return resolve(ok(data.aiNewIdentity))
      if (url === 'ai/analysis/batch') return reject(DEMO_LOCK)
      if (url === 'ai/analysis/confirmIdentity') return reject(DEMO_LOCK)

      // ========== AI 摘要 ==========
      if (url === 'ai/digest/list') {
        const size = params.size || 10
        return resolve(ok(data.aiDigestList.slice(0, size)))
      }
      if (url === 'ai/digest/generate') return resolve(ok(data.aiDigestToday))

      // ========== AI 对话 ==========
      if (url === 'ai/chat') {
        const replies = data.aiChatReplies
        return resolve(ok({
          reply: replies[Math.floor(Math.random() * replies.length)],
          timestamp: Date.now(),
          // 演示版模拟 Workers AI 正常返回（不降级）
          provider: 0,
          providerName: 'Workers AI (免费)',
          fallback: false,
          fallbackReason: ''
        }))
      }

      // ========== 安全中心 ==========
      if (url === 'security/list') return resolve(ok(data.securityList))
      if (url === 'security/stats') return resolve(ok(data.securityStats))
      if (url === 'security/setStatus') return reject(DEMO_LOCK)

      // ========== 邮件 ==========
      if (url === 'email/list') {
        const type = params.type || 0
        return resolve(ok(type === 1 ? data.sentEmails : data.inboxEmails))
      }
      if (url === 'email/latest') return resolve(ok([]))
      if (url === 'email/read') return resolve(ok(null))
      if (url === 'email/send' || url === 'email/delete') return reject(DEMO_LOCK)

      // ========== 星标 ==========
      if (url === 'star/list') return resolve(ok(data.starEmails))
      if (url === 'star/add' || url === 'star/cancel') return reject(DEMO_LOCK)

      // ========== Dashboard 统计 ==========
      if (url === 'dashboard/stats') return resolve(ok(data.dashboardStats))

      // ========== 账户 / 用户管理（演示版禁用） ==========
      if (['account/list', 'account/add', 'account/update', 'account/delete'].includes(url)) return reject(DEMO_LOCK)
      if (['user/list', 'user/add', 'user/update', 'user/delete'].includes(url)) return reject(DEMO_LOCK)
      if (['role/list', 'role/add', 'role/update', 'role/delete'].includes(url)) return reject(DEMO_LOCK)
      if (['reg-key/list', 'reg-key/add', 'reg-key/delete'].includes(url)) return reject(DEMO_LOCK)
      if (['all-email/list', 'all-email/delete'].includes(url)) return reject(DEMO_LOCK)
      if (url === 'analysis/list' || url === 'analysis/stats') return reject(DEMO_LOCK)
      // sys-setting GET 允许返回数据（让用户能看到 AI 配置卡片），POST 写操作锁
      if (url === 'sys-setting/query' && method === 'get') return resolve(ok(data.demoSysSetting))
      if (url.startsWith('sys-setting')) return reject(DEMO_LOCK)

      // ========== 未覆盖的接口 → 演示锁 ==========
      console.warn('[Demo] 未覆盖的接口:', method.toUpperCase(), url)
      reject(DEMO_LOCK)

    }, 50)
  })
}

function computeIdentityStats() {
  const map = {}
  data.identityList.forEach(item => {
    map[item.category] = (map[item.category] || 0) + 1
  })
  return Object.entries(map).map(([category, total]) => ({ category, total }))
}
