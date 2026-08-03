/**
 * CunInbox 演示模式中央数据源
 * 所有页面的 mock 数据集中在此文件，不依赖任何后端 API
 */

// ========== 用户与设置 ==========
export const userInfo = {
  account: {
    accountId: 10001,
    account: 'demo@cuninbox.ai',
    nickname: '演示用户',
    avatar: '',
    createTime: Date.now(),
    allReceive: 0
  },
  user: {
    userId: 1,
    username: 'demo',
    email: 'demo@cuninbox.ai',
    name: '演示用户',
    role: { name: 'USER', id: 1, sendType: 'day', sendCount: 50, accountCount: 5 }
  },
  permKeys: [
    'email:query', 'email:send', 'identity:query', 'assistant:use',
    'security:query', 'setting:update', 'star:query', 'draft:query'
  ],
  menus: []
}

export const websiteConfig = {
  title: 'CunInbox',
  domainList: ['cuninbox.ai'],
  websiteReg: true,
  projectLink: true,
  loginDomain: '',
  bgList: [],
  noticeTitle: 'CunInbox',
  noticeContent: '',
  noticePopup: 0,
  loginNotice: 0,
  autoRefresh: 0,
  send: 0,
  manyEmail: 0
}

// ========== 平台列表 ==========
export const platforms = [
  { platformId: 1, name: 'GitHub', logo: '🐙', domain: 'github.com' },
  { platformId: 2, name: 'Notion', logo: '📘', domain: 'notion.so' },
  { platformId: 3, name: 'Stripe', logo: '💳', domain: 'stripe.com' },
  { platformId: 4, name: '阿里云盘', logo: '☁️', domain: 'alipan.com' },
  { platformId: 5, name: 'Figma', logo: '🎨', domain: 'figma.com' },
  { platformId: 6, name: 'Linear', logo: '📊', domain: 'linear.app' },
  { platformId: 7, name: '哔哩哔哩', logo: '📺', domain: 'bilibili.com' },
  { platformId: 8, name: 'Google', logo: '🔍', domain: 'google.com' },
  { platformId: 9, name: 'Apple', logo: '🍎', domain: 'apple.com' },
  { platformId: 10, name: 'Microsoft', logo: '🪟', domain: 'microsoft.com' },
  { platformId: 11, name: 'Amazon', logo: '📦', domain: 'amazon.com' },
  { platformId: 12, name: 'OpenAI', logo: '🤖', domain: 'openai.com' },
  { platformId: 13, name: 'Cloudflare', logo: '🟠', domain: 'cloudflare.com' },
  { platformId: 14, name: 'Vercel', logo: '▲', domain: 'vercel.com' },
  { platformId: 15, name: 'Discord', logo: '🎮', domain: 'discord.com' },
  { platformId: 16, name: 'Twitter/X', logo: '🐦', domain: 'x.com' },
  { platformId: 17, name: 'YouTube', logo: '▶️', domain: 'youtube.com' },
  { platformId: 18, name: 'Twitch', logo: '🟣', domain: 'twitch.tv' },
  { platformId: 19, name: 'Steam', logo: '🎮', domain: 'steampowered.com' },
  { platformId: 20, name: 'PlayStation', logo: '🎮', domain: 'playstation.com' },
  { platformId: 21, name: '微信', logo: '💬', domain: 'weixin.qq.com' },
  { platformId: 22, name: '支付宝', logo: '💰', domain: 'alipay.com' },
  { platformId: 23, name: '淘宝', logo: '🛒', domain: 'taobao.com' },
  { platformId: 24, name: '京东', logo: '📦', domain: 'jd.com' },
  { platformId: 25, name: '抖音', logo: '🎵', domain: 'douyin.com' },
  { platformId: 26, name: '小红书', logo: '📕', domain: 'xiaohongshu.com' },
  { platformId: 27, name: '知乎', logo: '💡', domain: 'zhihu.com' },
  { platformId: 28, name: 'CSDN', logo: '📝', domain: 'csdn.net' },
  { platformId: 29, name: '掘金', logo: '⛏️', domain: 'juejin.cn' },
  { platformId: 30, name: 'Stack Overflow', logo: '📚', domain: 'stackoverflow.com' },
  { platformId: 31, name: 'Docker Hub', logo: '🐳', domain: 'hub.docker.com' },
  { platformId: 32, name: 'npm', logo: '📦', domain: 'npmjs.com' },
  { platformId: 33, name: 'Hugging Face', logo: '🤗', domain: 'huggingface.co' },
  { platformId: 34, name: 'Supabase', logo: '⚡', domain: 'supabase.com' },
  { platformId: 35, name: 'AWS', logo: '☁️', domain: 'aws.amazon.com' },
  { platformId: 36, name: '腾讯云', logo: '☁️', domain: 'cloud.tencent.com' },
  { platformId: 37, name: '阿里云', logo: '☁️', domain: 'aliyun.com' },
  { platformId: 38, name: 'JetBrains', logo: '🧠', domain: 'jetbrains.com' },
  { platformId: 39, name: 'ChatGPT', logo: '💬', domain: 'chat.openai.com' },
  { platformId: 40, name: 'Claude', logo: '🤖', domain: 'claude.ai' },
  { platformId: 41, name: 'Midjourney', logo: '🎨', domain: 'midjourney.com' },
  { platformId: 42, name: 'Cursor', logo: '🖱️', domain: 'cursor.sh' },
  { platformId: 43, name: 'Replit', logo: '💻', domain: 'replit.com' },
  { platformId: 44, name: 'GitLab', logo: '🦊', domain: 'gitlab.com' },
  { platformId: 45, name: 'Bitbucket', logo: '🪣', domain: 'bitbucket.org' },
  { platformId: 46, name: 'Slack', logo: '💼', domain: 'slack.com' },
  { platformId: 47, name: 'Trello', logo: '📋', domain: 'trello.com' },
  { platformId: 48, name: 'Zoom', logo: '📹', domain: 'zoom.us' },
  { platformId: 49, name: 'Netflix', logo: '🎬', domain: 'netflix.com' },
  { platformId: 50, name: 'Spotify', logo: '🎵', domain: 'spotify.com' },
]

// ========== 数字身份 ==========
export const identityList = [
  { identityId: 1, name: 'GitHub', platformId: 1, category: 'dev', identityEmail: 'dev@cuninbox.ai', status: 0,
    registerTime: '2024-03-18', purpose: '代码托管与团队协作', remark: 'SSH keys 3个', totalAliases: 3 },
  { identityId: 2, name: 'Notion', platformId: 2, category: 'saas', identityEmail: 'work@cuninbox.ai', status: 0,
    registerTime: '2024-05-02', purpose: '知识库与文档协作', remark: '付费Pro版', totalAliases: 1 },
  { identityId: 3, name: 'Stripe', platformId: 3, category: 'finance', identityEmail: 'pay@cuninbox.ai', status: 0,
    registerTime: '2024-07-22', purpose: '信用卡在线支付处理', remark: '已完成商户验证', totalAliases: 1 },
  { identityId: 4, name: '阿里云盘', platformId: 4, category: 'cloud', identityEmail: 'pan@cuninbox.ai', status: 0,
    registerTime: '2023-12-15', purpose: '个人文件备份', remark: '容量 1.8T', totalAliases: 2 },
  { identityId: 5, name: 'Figma', platformId: 5, category: 'dev', identityEmail: 'ui@cuninbox.ai', status: 1,
    registerTime: '2024-01-09', purpose: 'UI 设计稿协同', remark: '半年未登录', totalAliases: 1 },
  { identityId: 6, name: 'Linear', platformId: 6, category: 'dev', identityEmail: 'task@cuninbox.ai', status: 0,
    registerTime: '2024-09-12', purpose: '项目任务追踪', remark: '', totalAliases: 1 },
  { identityId: 7, name: '哔哩哔哩大会员', platformId: 7, category: 'social', identityEmail: 'fun@cuninbox.ai', status: 2,
    registerTime: '2022-08-04', purpose: '追剧/视频', remark: '长期未登录，安全等级中', totalAliases: 1 },
  { identityId: 8, name: 'OpenAI', platformId: 12, category: 'ai', identityEmail: 'ai@cuninbox.ai', status: 0,
    registerTime: '2024-11-01', purpose: 'AI 对话与 API 调用', remark: 'Plus 订阅', totalAliases: 1 },
  { identityId: 9, name: 'Cloudflare', platformId: 13, category: 'cloud', identityEmail: 'cf@cuninbox.ai', status: 0,
    registerTime: '2023-06-20', purpose: 'DNS/CDN/Workers', remark: 'Pro Plan', totalAliases: 2 },
  { identityId: 10, name: 'Vercel', platformId: 14, category: 'dev', identityEmail: 'deploy@cuninbox.ai', status: 0,
    registerTime: '2024-02-14', purpose: '前端部署与托管', remark: 'Pro Team', totalAliases: 1 },
  { identityId: 11, name: 'Docker Hub', platformId: 31, category: 'dev', identityEmail: 'docker@cuninbox.ai', status: 0,
    registerTime: '2024-04-08', purpose: '容器镜像仓库', remark: '', totalAliases: 1 },
  { identityId: 12, name: 'Twitter/X', platformId: 16, category: 'social', identityEmail: 'social@cuninbox.ai', status: 2,
    registerTime: '2021-03-15', purpose: '社交媒体运营', remark: '长期未登录', totalAliases: 1 },
]

// ========== AI 分析 ==========
export const aiStats = {
  totalEmails: 248,
  analyzedEmails: 248,
  pendingEmails: 0,
  categories: [
    { category: 'security', label: '安全通知', count: 32, color: '#ef4444' },
    { category: 'bill', label: '账单收据', count: 28, color: '#f59e0b' },
    { category: 'dev', label: '开发相关', count: 45, color: '#3b82f6' },
    { category: 'social', label: '社交动态', count: 36, color: '#ec4899' },
    { category: 'newsletter', label: '订阅资讯', count: 52, color: '#6366f1' },
    { category: 'ai', label: 'AI 服务', count: 18, color: '#8b5cf6' },
    { category: 'other', label: '其他', count: 37, color: '#64748b' },
  ]
}

export const aiAnalysisList = [
  { analysisId: 1, emailId: 10001, category: 'security', confidence: 0.98, summary: 'GitHub 安全警报：检测到新设备登录',
    createTime: Date.now() - 3600000, platform: 'GitHub' },
  { analysisId: 2, emailId: 10002, category: 'bill', confidence: 0.95, summary: 'Stripe 月度账单收据 - $29.00',
    createTime: Date.now() - 7200000, platform: 'Stripe' },
  { analysisId: 3, emailId: 10003, category: 'dev', confidence: 0.92, summary: 'Vercel 部署成功通知 - cuninbox.ai',
    createTime: Date.now() - 10800000, platform: 'Vercel' },
  { analysisId: 4, emailId: 10004, category: 'newsletter', confidence: 0.88, summary: 'Notion 每周摘要 - 您创建了 5 个文档',
    createTime: Date.now() - 14400000, platform: 'Notion' },
  { analysisId: 5, emailId: 10005, category: 'ai', confidence: 0.96, summary: 'OpenAI API 使用量提醒 - 已用 80%',
    createTime: Date.now() - 18000000, platform: 'OpenAI' },
  { analysisId: 6, emailId: 10006, category: 'social', confidence: 0.85, summary: '哔哩哔哩关注的 UP 主更新了视频',
    createTime: Date.now() - 21600000, platform: '哔哩哔哩' },
  { analysisId: 7, emailId: 10007, category: 'security', confidence: 0.99, summary: 'Cloudflare 检测到异常流量，已自动拦截',
    createTime: Date.now() - 25200000, platform: 'Cloudflare' },
  { analysisId: 8, emailId: 10008, category: 'bill', confidence: 0.94, summary: '阿里云 8 月账单 - ￥128.00',
    createTime: Date.now() - 28800000, platform: '阿里云' },
]

export const aiNewIdentity = [
  { id: 1, analysisId: 1, platform: 'Replit', email: 'replit-user@cuninbox.ai',
    sendEmail: 'noreply@replit.com', subject: 'Welcome to Replit - 账户已创建',
    summary: 'AI 在邮件中发现 Replit 注册信息，置信度 91%', category: 'dev',
    confidence: 0.91, source: '注册确认邮件', createTime: Date.now() - 86400000 },
  { id: 2, analysisId: 2, platform: 'Supabase', email: 'supabase@cuninbox.ai',
    sendEmail: 'noreply@supabase.com', subject: 'Supabase 账户已激活',
    summary: 'AI 在欢迎邮件中发现 Supabase 账户，置信度 87%', category: 'dev',
    confidence: 0.87, source: '欢迎邮件', createTime: Date.now() - 172800000 },
  { id: 3, analysisId: 3, platform: 'Hugging Face', email: 'hf@cuninbox.ai',
    sendEmail: 'noreply@huggingface.co', subject: 'Your API Key is ready',
    summary: 'AI 在 API Key 通知中发现 Hugging Face 账户，置信度 83%', category: 'ai',
    confidence: 0.83, source: 'API Key 通知', createTime: Date.now() - 259200000 },
  { id: 4, analysisId: 4, platform: 'Cursor', email: 'cursor@cuninbox.ai',
    sendEmail: 'noreply@cursor.sh', subject: 'Cursor 订阅确认',
    summary: 'AI 在订阅确认邮件中发现 Cursor 账户，置信度 79%', category: 'dev',
    confidence: 0.79, source: '订阅确认', createTime: Date.now() - 345600000 },
  { id: 5, analysisId: 5, platform: 'JetBrains', email: 'jb@cuninbox.ai',
    sendEmail: 'noreply@jetbrains.com', subject: 'JetBrains 许可证已激活',
    summary: 'AI 在许可证邮件中发现 JetBrains 账户，置信度 75%', category: 'dev',
    confidence: 0.75, source: '许可证激活邮件', createTime: Date.now() - 432000000 },
]

// ========== AI 摘要 ==========
function buildDigestContent(summary, highlights) {
  return '▶ ' + summary + '\n─────────────────────────────\n' +
    highlights.map(h => '  • ' + h).join('\n')
}

export const aiDigestList = [
  { digestId: 1, date: '2026-08-01', digestDate: '2026-08-01',
    summary: '今日共接收 18 封邮件，AI 自动分类完成。其中安全通知 3 封、开发相关 5 封、订阅资讯 4 封、账单 2 封、其他 4 封。',
    highlights: [
      'GitHub 检测到新设备登录，建议检查是否为本人操作',
      'Stripe 自动扣款 $29.00（Pro 计划月费）',
      'Vercel 部署成功：cuninbox.ai 已更新',
      'OpenAI API 用量达 80%，建议关注额度'
    ],
    importantCount: 1,
    securityAlerts: 1,
    newIdentities: 0,
    createTime: Date.now() - 86400000
  },
  { digestId: 2, date: '2026-07-31', digestDate: '2026-07-31',
    summary: '今日共接收 22 封邮件，AI 自动分类完成。发现 1 个新数字身份（Replit），1 个安全预警。',
    highlights: [
      'AI 自动发现 Replit 数字身份，置信度 91%',
      'Cloudflare 拦截异常流量 234 次',
      'Notion 周报：本周创建 5 个文档',
      'Figma 协作邀请：前端设计稿 V2'
    ],
    importantCount: 2,
    securityAlerts: 1,
    newIdentities: 1,
    createTime: Date.now() - 172800000
  },
  { digestId: 3, date: '2026-07-30', digestDate: '2026-07-30',
    summary: '今日共接收 15 封邮件，AI 自动分类完成。无安全预警，无新身份发现。',
    highlights: [
      '阿里云 8 月账单已生成：￥128.00',
      'GitHub Actions 构建失败通知 x2',
      '哔哩哔哩 3 个关注的 UP 主更新了视频',
      'Linear 本周冲刺完成率 85%'
    ],
    importantCount: 0,
    securityAlerts: 0,
    newIdentities: 0,
    createTime: Date.now() - 259200000
  },
]
// 给每条 digest 注入 content 字段（页面期望 item.content）
aiDigestList.forEach(d => { d.content = buildDigestContent(d.summary, d.highlights) })

export const aiDigestToday = {
  digestId: 99, date: '2026-08-02', digestDate: '2026-08-02',
  summary: '今日共接收 12 封邮件，AI 已全部自动分类。检测到 1 个高危安全事件，发现 2 个潜在新数字身份。',
  highlights: [
    '[安全] 检测到来自 IP 185.220.101.47 的异常登录尝试，已自动拦截',
    '[发现] AI 在邮件中发现 Replit 账户信息，置信度 91%',
    '[发现] AI 在邮件中发现 Supabase 账户信息，置信度 87%',
    '[账单] Stripe 自动扣款 $29.00（Pro 计划月费）',
    '[部署] Vercel 部署成功：cuninbox.ai 已更新至 v2.0',
    '[提醒] OpenAI API 用量达 80%，建议关注剩余额度'
  ],
  importantCount: 3,
  securityAlerts: 1,
  newIdentities: 2,
  suggestions: [
    '建议立即检查 GitHub 登录设备列表，移除未知设备',
    '建议为 Replit 和 Supabase 创建数字身份记录',
    '建议开启 OpenAI API 用量告警，避免超额'
  ],
  createTime: Date.now()
}
aiDigestToday.content = buildDigestContent(aiDigestToday.summary, aiDigestToday.highlights) +
  '\n─────────────────────────────\n▶ 安全建议\n' +
  aiDigestToday.suggestions.map(s => '  → ' + s).join('\n')

export const aiChatReplies = [
  '根据 AI 分析，您目前共有 12 个活跃数字身份，分布在 7 个类别中。其中开发类 4 个、云服务 2 个、AI 工具 1 个。建议定期清理长期未使用的身份（如 Figma 和 Twitter/X），以降低安全风险。',
  '在最近 7 天的邮件中，AI 共发现 2 个新的数字身份线索：Replit（置信度 91%）和 Supabase（置信度 87%）。您可以在「数字身份」页面确认并添加这些身份。',
  '安全分析报告：检测到 1 个高危事件（异常登录尝试），建议立即检查 GitHub 账户的登录设备列表。此外，您的 Figma 和 Twitter/X 身份已长期未活跃，建议评估是否需要停用或删除。',
  'AI 邮件分类统计：本周共处理 248 封邮件，其中安全通知 32 封、订阅资讯 52 封、开发相关 45 封。自动分类准确率 96.3%，无需手动调整。'
]

// ========== AI 状态（演示版：模拟 Workers AI 主用 + DeepSeek 降级已启用） ==========
export const aiStatusInfo = {
  provider: 0,                       // 0=Workers AI
  primaryLabel: 'Workers AI (免费)',
  primaryModel: '@cf/meta/llama-4-scout-17b-16e-instruct',
  primaryBaseUrl: 'Cloudflare 内置',
  hasWorkersAI: true,
  fallbackEnabled: true,
  fallbackLabel: 'deepseek-chat @ https://api.deepseek.com',
  fallbackModel: 'deepseek-chat',
  fallbackBaseUrl: 'https://api.deepseek.com'
}

// ========== 系统设置（演示版：AI 配置部分 + 必要字段） ==========
export const demoSysSetting = {
  // 基础字段（演示版用最小化默认值）
  register: 0,
  loginDomain: 0,
  regKey: 1,
  addEmail: 0,
  manyEmail: 0,
  minEmailPrefix: 1,
  emailPrefixFilter: [],
  title: 'CunInbox',
  loginOpacity: 0.88,
  background: '',
  receive: 0,
  send: 0,
  autoRefresh: 5,
  noRecipient: 1,
  resendTokens: {},
  r2Domain: 'demo.cuninbox.ai',
  bucket: 'cuninbox-demo',
  region: 'auto',
  endpoint: 'https://demo.r2.cloudflarestorage.com',
  s3AccessKey: '',
  s3SecretKey: '',
  forcePathStyle: 1,
  customDomain: '',
  storageType: 'r2',
  hasR2: true,
  tgBotStatus: 1,
  tgBotToken: '',
  tgChatId: '',
  tgMsgFrom: 'only-name',
  tgMsgTo: 'show',
  tgMsgText: 'hide',
  forwardStatus: 1,
  forwardEmail: '',
  ruleType: 0,
  ruleEmail: '',
  registerVerify: 1,
  addEmailVerify: 1,
  regVerifyCount: 1,
  addVerifyCount: 1,
  siteKey: 'demo_xxxxxx',
  secretKey: 'demo_xxxxxx',
  notice: 1,
  noticeTitle: 'CunInbox',
  noticeContent: '演示版本，所有写操作已禁用',
  noticeType: 'none',
  noticeDuration: 0,
  noticePosition: 'top-right',
  noticeOffset: 0,
  noticeWidth: 340,
  domainList: ['@demo.cuninbox.ai'],
  regVerifyOpen: false,
  addVerifyOpen: false,
  // AI 配置
  aiProvider: 0,
  aiApiKey: '',
  aiBaseUrl: 'https://api.deepseek.com',
  aiModel: 'deepseek-chat',
  aiAnalysisStatus: 1,
  aiFallbackStatus: 0,               // 0=启用降级
  aiFallbackApiKey: '',
  aiFallbackBaseUrl: 'https://api.deepseek.com',
  aiFallbackModel: 'deepseek-chat'
}

// ========== 安全中心 ==========
export const securityStats = {
  total: 7,
  unprocessed: 6,
  highRisk: 2
}

export const securityList = [
  { eventId: 1, type: 'abnormal_login', riskLevel: 2, platform: 'GitHub',
    title: '异常登录尝试', description: '检测到来自 IP 185.220.101.47 的登录尝试，该 IP 位于未知地区',
    createTime: Date.now() - 3600000, status: 0, suggestion: '立即检查 GitHub 登录设备列表，移除未知设备并修改密码' },
  { eventId: 2, type: 'data_breach', riskLevel: 2, platform: 'Notion',
    title: '数据泄露预警', description: '您的邮箱地址出现在近期泄露数据库中',
    createTime: Date.now() - 86400000, status: 0, suggestion: '建议立即更换 Notion 密码并启用两步验证' },
  { eventId: 3, type: 'weak_password', riskLevel: 1, platform: 'Figma',
    title: '弱密码风险', description: '检测到 Figma 账户使用弱密码，且与其他平台密码重复',
    createTime: Date.now() - 172800000, status: 0, suggestion: '更换为强密码，不要与其他平台共用' },
  { eventId: 4, type: 'expired_auth', riskLevel: 1, platform: 'Twitter/X',
    title: 'OAuth 授权过期未清理', description: 'Twitter/X 有 3 个第三方应用授权已超过 6 个月未使用',
    createTime: Date.now() - 259200000, status: 0, suggestion: '前往 Twitter 设置清理不必要的第三方授权' },
  { eventId: 5, type: 'inactive_account', riskLevel: 0, platform: '哔哩哔哩',
    title: '长期未活跃账户', description: '哔哩哔哩大会员账户已超过 180 天未登录',
    createTime: Date.now() - 345600000, status: 0, suggestion: '如不再使用，建议注销或降级账户' },
  { eventId: 6, type: 'inactive_account', riskLevel: 0, platform: 'Twitter/X',
    title: '长期未活跃账户', description: 'Twitter/X 账户已超过 180 天未登录',
    createTime: Date.now() - 432000000, status: 0, suggestion: '如不再使用，建议注销账户' },
  { eventId: 7, type: 'password_reuse', riskLevel: 0, platform: '阿里云盘',
    title: '密码复用风险', description: '阿里云盘密码与 2 个其他平台相同',
    createTime: Date.now() - 518400000, status: 1, suggestion: '更换为独立密码' },
]

// ========== 邮件列表 ==========
const emailSenders = [
  { name: 'GitHub', email: 'noreply@github.com' },
  { name: 'Notion', email: 'team@makenotion.com' },
  { name: 'Stripe', email: 'receipts@stripe.com' },
  { name: '阿里云盘', email: 'noreply@alipan.com' },
  { name: 'Figma', email: 'no-reply@figma.com' },
  { name: 'Linear', email: 'notifications@linear.app' },
  { name: '哔哩哔哩', email: 'noreply@bilibili.com' },
  { name: 'Vercel', email: 'noreply@vercel.com' },
  { name: 'OpenAI', email: 'noreply@openai.com' },
  { name: 'Cloudflare', email: 'noreply@cloudflare.com' },
]

const emailSubjects = [
  '您的账户安全报告 - 检测到新的登录设备',
  'AI 身份发现：检测到您在 Notion 的数字身份',
  'Weekly Digest: Your design activity summary',
  '订阅续期提醒：Pro 计划将于 7 天后到期',
  '新设备登录提醒 - 请确认是否为本人操作',
  '数据泄露预警：您的凭据出现在近期泄露数据库中',
  '欢迎来到 CunInbox - AI 驱动的数字身份中心',
  '安全建议：建议开启两步验证以保护账户',
  '您的数字身份矩阵月报已生成',
  'AI 自动分类完成：已为您整理 248 封邮件',
]

const emailContents = [
  '我们检测到您的账户在新设备上登录。如果不是本人操作，请立即修改密码并启用两步验证。',
  'CunInbox AI 引擎在您的邮件中发现了 Notion 相关的账户信息，已自动为您创建数字身份记录。',
  '本周您在 Figma 上创建了 12 个设计文件，参与了 5 次协作。点击查看详细数据可视化报告。',
  '您的 Pro 计划订阅将于 2026-08-09 到期，届时将自动续费。如需取消请前往账户设置。',
  '检测到来自 IP 185.220.101.47 的异常登录尝试。该 IP 位于未知地区，已自动拦截。',
  '在最近的数据泄露事件中，您的邮箱地址和密码哈希被泄露。强烈建议您立即更换密码。',
  '感谢注册 CunInbox。我们帮助您集中管理所有互联网平台的数字身份、通信记录和安全信息。',
  '根据 AI 安全分析，您的账户未启用两步验证。启用后可将账户被盗风险降低 99%。',
  '本月您共活跃于 12 个数字身份平台，接收 248 封邮件，AI 自动分类 7 个类别。',
  'AI 引擎已完成本周邮件分析，自动识别出 3 个新的数字身份并归类了 248 封邮件。',
]

function buildEmailList(type, count) {
  const now = Date.now()
  const list = []
  for (let i = 0; i < count; i++) {
    const sender = emailSenders[i % emailSenders.length]
    const statusMap = type === 1 ? [1, 2, 1, 2, 1, 2, 1, 2, 1, 2] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    list.push({
      emailId: 10000 - i,
      name: sender.name,
      sendEmail: type === 1 ? 'demo@cuninbox.ai' : sender.email,
      toEmail: type === 1 ? sender.email : 'demo@cuninbox.ai',
      subject: emailSubjects[i % emailSubjects.length],
      text: emailContents[i % emailContents.length],
      content: '<p>' + emailContents[i % emailContents.length] + '</p>',
      createTime: now - i * 3600000 * (i + 3),
      isStar: i < 5 ? 1 : 0,
      unread: i < 8 ? 1 : 0,
      status: statusMap[i % statusMap.length],
      isDel: 0,
      userEmail: 'demo@cuninbox.ai',
    })
  }
  return { list, latestEmail: list[0], total: count }
}

export const inboxEmails = buildEmailList(0, 20)
export const sentEmails = buildEmailList(1, 15)

export const starEmails = {
  list: [
    { emailId: 20001, name: 'GitHub', sendEmail: 'noreply@github.com', toEmail: 'demo@cuninbox.ai',
      subject: '您的账户安全报告', text: '检测到新的登录设备', content: '<p>检测到新的登录设备</p>',
      createTime: Date.now() - 3600000, isStar: 1, unread: 0, status: 0, isDel: 0, userEmail: 'demo@cuninbox.ai' },
    { emailId: 20002, name: 'OpenAI', sendEmail: 'noreply@openai.com', toEmail: 'demo@cuninbox.ai',
      subject: '欢迎来到 CunInbox', text: 'AI 驱动的数字身份中心', content: '<p>AI 驱动的数字身份中心</p>',
      createTime: Date.now() - 7200000, isStar: 1, unread: 0, status: 0, isDel: 0, userEmail: 'demo@cuninbox.ai' },
    { emailId: 20003, name: 'Cloudflare', sendEmail: 'noreply@cloudflare.com', toEmail: 'demo@cuninbox.ai',
      subject: '安全建议：开启两步验证', text: '可将账户被盗风险降低 99%', content: '<p>可将账户被盗风险降低 99%</p>',
      createTime: Date.now() - 10800000, isStar: 1, unread: 0, status: 0, isDel: 0, userEmail: 'demo@cuninbox.ai' },
    { emailId: 20004, name: 'Vercel', sendEmail: 'noreply@vercel.com', toEmail: 'demo@cuninbox.ai',
      subject: '数字身份矩阵月报', text: '本月共活跃 12 个平台', content: '<p>本月共活跃 12 个平台</p>',
      createTime: Date.now() - 14400000, isStar: 1, unread: 0, status: 0, isDel: 0, userEmail: 'demo@cuninbox.ai' },
    { emailId: 20005, name: 'Figma', sendEmail: 'no-reply@figma.com', toEmail: 'demo@cuninbox.ai',
      subject: 'AI 自动分类完成', text: '已整理 248 封邮件', content: '<p>已整理 248 封邮件</p>',
      createTime: Date.now() - 18000000, isStar: 1, unread: 0, status: 0, isDel: 0, userEmail: 'demo@cuninbox.ai' },
  ],
  latestEmail: null,
  total: 5
}
starEmails.latestEmail = starEmails.list[0]

// ========== Dashboard 统计 ==========
export const dashboardStats = {
  identityCount: 12,
  analyzedEmails: 248,
  riskCount: 1,
  suggestCount: 5
}
