<template>
  <div id="login-box" v-loading="oauthLoading" element-loading-text="登录中...">
    <!-- 深空背景：径向星云 + 网格点阵 + 扫光线 -->
    <div class="ci-login-bg">
      <div class="ci-login-bg__nebula ci-login-bg__nebula--1"></div>
      <div class="ci-login-bg__nebula ci-login-bg__nebula--2"></div>
      <div class="ci-login-bg__nebula ci-login-bg__nebula--3"></div>
      <div class="ci-login-bg__grid"></div>
      <div class="ci-login-bg__particles">
        <span v-for="i in 18" :key="'dot'+i" class="ci-login-bg__dot" :style="particleStyle(i)"></span>
      </div>
    </div>

    <!-- 中央登录卡片（自动循环扫光） -->
    <div class="ci-login-card ci-shimmer-auto">

      <!-- 顶部：Logo -->
      <div class="ci-login-card__header">
        <CiLogo size="lg" :animated="true" :showText="true"/>
        <div class="ci-login-card__tagline">AI 驱动的个人数字身份中心</div>
        <div class="ci-login-card__title" v-if="show === 'login'">{{ $t('loginTitle') }}</div>
        <div class="ci-login-card__title" v-else>{{ $t('regTitle') }}</div>
      </div>

      <!-- 登录表单 -->
      <div v-show="show === 'login'" class="ci-login-card__body">
        <div class="ci-input-group ci-shimmer-line">
          <label class="ci-input-label">{{ $t('emailAccount') }}</label>
          <el-input
            :class="settingStore.settings.loginDomain === 0 ? 'email-input' : ''"
            v-model="form.email"
            type="text"
            :placeholder="'your@email.com'"
            autocomplete="off"
          >
            <template #append v-if="settingStore.settings.loginDomain === 0">
              <div class="ci-domain-select" @click.stop="openSelect">
                <span class="ci-domain-select__value">{{ suffix || '@domain' }}</span>
                <Icon icon="mingcute:down-small-fill" width="16" height="16" class="ci-domain-select__icon"/>
                <el-select
                  v-if="show === 'login'"
                  ref="mySelect"
                  v-model="suffix"
                  :placeholder="$t('select')"
                  class="select"
                >
                  <el-option v-for="item in domainList" :key="item" :label="item" :value="item"/>
                </el-select>
              </div>
            </template>
          </el-input>
        </div>

        <div class="ci-input-group ci-shimmer-line">
          <label class="ci-input-label">{{ $t('password') }}</label>
          <el-input v-model="form.password" :placeholder="'••••••'" type="password" autocomplete="off"/>
        </div>

        <el-button class="ci-btn-submit ci-shimmer-wrap" type="primary" @click="submit" :loading="loginLoading">
          <Icon icon="mdi:connection" width="16" height="16" style="margin-right:6px"/>
          {{ $t('loginBtn') }}
        </el-button>

        <el-button v-if="settingStore.settings.linuxdoSwitch" class="ci-btn-linuxdo ci-shimmer-wrap" @click="linuxDoLogin">
          <el-avatar src="/image/linuxdo.webp" :size="18" style="margin-right: 10px"/> LinuxDo
        </el-button>

        <!-- 演示模式入口 -->
        <div class="ci-demo-entry">
          <div class="ci-demo-entry__line"></div>
          <span>无后端环境？</span>
          <el-button link type="primary" class="ci-demo-entry__btn" @click="demoLogin">
            <Icon icon="mdi:flash" width="14" height="14" style="margin-right:4px"/>
            进入演示模式
          </el-button>
          <div class="ci-demo-entry__line"></div>
        </div>
      </div>

      <!-- 注册表单 -->
      <div v-show="show !== 'login'" class="ci-login-card__body">
        <div class="ci-input-group ci-shimmer-line">
          <label class="ci-input-label">{{ $t('emailAccount') }}</label>
          <el-input class="email-input" v-model="registerForm.email" type="text"
                    :placeholder="'your@email.com'" autocomplete="off">
            <template #append>
              <div class="ci-domain-select" @click.stop="openSelect">
                <span class="ci-domain-select__value">{{ suffix || '@domain' }}</span>
                <Icon icon="mingcute:down-small-fill" width="16" height="16" class="ci-domain-select__icon"/>
                <el-select
                  v-if="show !== 'login'"
                  ref="mySelect"
                  v-model="suffix"
                  :placeholder="$t('select')"
                  class="select"
                >
                  <el-option v-for="item in domainList" :key="item" :label="item" :value="item"/>
                </el-select>
              </div>
            </template>
          </el-input>
        </div>

        <div class="ci-input-group ci-shimmer-line">
          <label class="ci-input-label">{{ $t('password') }}</label>
          <el-input v-model="registerForm.password" :placeholder="'至少6位'" type="password" autocomplete="off"/>
        </div>

        <div class="ci-input-group ci-shimmer-line">
          <label class="ci-input-label">{{ $t('confirmPwd') }}</label>
          <el-input v-model="registerForm.confirmPassword" :placeholder="'再次输入密码'" type="password"
                    autocomplete="off"/>
        </div>

        <div class="ci-input-group ci-shimmer-line" v-if="settingStore.settings.regKey === 0 || settingStore.settings.regKey === 2">
          <label class="ci-input-label" v-if="settingStore.settings.regKey === 0">{{ $t('regKey') }}</label>
          <el-input v-if="settingStore.settings.regKey === 0" v-model="registerForm.code"
                    :placeholder="$t('regKey')" type="text" autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 2" v-model="registerForm.code"
                    :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
        </div>

        <div v-show="verifyShow" class="register-turnstile"
             :data-sitekey="settingStore.settings.siteKey"
             data-callback="onTurnstileSuccess"
             data-error-callback="onTurnstileError"
             data-after-interactive-callback="loadAfter"
             data-before-interactive-callback="loadBefore">
          <span v-if="botJsError" class="ci-warn">{{ $t('verifyModuleFailed') }}</span>
        </div>

        <el-button class="ci-btn-submit ci-shimmer-wrap" style="margin:0" type="primary"
                   @click="submitRegister" :loading="registerLoading">
          <Icon icon="mdi:account-plus-outline" width="16" height="16" style="margin-right:6px"/>
          {{ $t('regBtn') }}
        </el-button>
        <el-button v-if="settingStore.settings.linuxdoSwitch" class="ci-btn-linuxdo ci-shimmer-wrap" @click="linuxDoLogin">
          <el-avatar src="/image/linuxdo.webp" :size="18" style="margin-right: 10px"/> LinuxDo
        </el-button>
      </div>

      <!-- 底部：登录/注册切换 + 版权 -->
      <div class="ci-login-card__footer">
        <template v-if="settingStore.settings.register === 0">
          <div class="ci-switch" @click="show = 'register'" v-if="show === 'login'">
            {{ $t('noAccount') }}<span>{{ $t('regSwitch') }}</span>
          </div>
          <div class="ci-switch" @click="show = 'login'" v-else>
            {{ $t('hasAccount') }}<span>{{ $t('loginSwitch') }}</span>
          </div>
        </template>
        <div class="ci-copyright">
          <Icon icon="mdi:shield-check-outline" width="12" height="12" style="margin-right:4px"/>
          Powered by Cunzhang Lab · {{ settingStore.settings.title || 'CunInbox' }}
        </div>
      </div>
    </div>

    <!-- 绑定邮箱弹框 -->
    <el-dialog class="bind-dialog" v-model="showBindForm" title="注册邮箱">
      <div class="bind-container">
        <el-input v-model="bindForm.email" type="text" :placeholder="$t('emailAccount')" autocomplete="off">
          <template #append>
            <div @click.stop="openSelect">
              <el-select ref="mySelect" v-model="suffix" :placeholder="$t('select')" class="select">
                <el-option v-for="item in domainList" :key="item" :label="item" :value="item"/>
              </el-select>
              <div>
                <span>{{ suffix }}</span>
                <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
              </div>
            </div>
          </template>
        </el-input>
        <el-input v-if="settingStore.settings.regKey === 0" v-model="bindForm.code" :placeholder="$t('regKey')"
                  type="text" autocomplete="off"/>
        <el-input v-if="settingStore.settings.regKey === 2" v-model="bindForm.code"
                  :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
        <el-button class="ci-btn-submit" type="primary" @click="bind" :loading="bindLoading">
          绑定
        </el-button>
      </div>
    </el-dialog>

    <!-- 右上角：GitHub 链接 -->
    <a v-show="settingStore.settings.projectLink" class="ci-github" href="https://github.com/cunzhangcrypto/CunInbox"
       :title="'CunInbox on GitHub'">
      <Icon icon="mingcute:github-line" width="18" height="18"/>
    </a>
  </div>
</template>

<script setup>
import router from "@/router";
import {computed, nextTick, reactive, ref} from "vue";
import {login} from "@/request/login.js";
import {register} from "@/request/login.js";
import {isEmail} from "@/utils/verify-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {useUserStore} from "@/store/user.js";
import {useUiStore} from "@/store/ui.js";
import {Icon} from "@iconify/vue";
import {cvtR2Url} from "@/utils/convert.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import {useI18n} from "vue-i18n";
import {oauthBindUser, oauthLinuxDoLogin} from "@/request/ouath.js";
import CiLogo from "@/components/ci-logo/index.vue";

const {t} = useI18n();
const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const loginLoading = ref(false)
const bindLoading = ref(false)
const oauthLoading = ref(false);
const showBindForm = ref(false);
const show = ref('login')

const bindForm = reactive({
  email: '',
  oauthUserId: '',
  code: ''
})

const form = reactive({
  email: '',
  password: '',
});
const mySelect = ref()
const suffix = ref('')
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: null
})
const domainList = settingStore.domainList;
const registerLoading = ref(false)
suffix.value = domainList[0]
const verifyShow = ref(false)
let verifyToken = ''
let turnstileId = null
let botJsError = ref(false)
let verifyErrorCount = 0

window.onTurnstileSuccess = (token) => { verifyToken = token; };
window.onTurnstileError = (e) => {
  if (verifyErrorCount >= 4) return
  verifyErrorCount++
  setTimeout(() => {
    nextTick(() => {
      if (!turnstileId) {
        turnstileId = window.turnstile.render('.register-turnstile')
      } else {
        window.turnstile.reset(turnstileId);
      }
    })
  }, 1500)
};
window.loadAfter = () => {}
window.loadBefore = () => {}

const loginOpacity = computed(() => {
  const opacity = settingStore.settings.loginOpacity
  return uiStore.dark ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`
})

// 兼容旧的自定义背景逻辑（如果设置了就用，没有就用科技感背景）
const background = computed(() => settingStore.settings.background ? {
  'background-image': `url(${cvtR2Url(settingStore.settings.background)})`,
  'background-repeat': 'no-repeat',
  'background-size': 'cover',
  'background-position': 'center'
} : '')

const openSelect = () => mySelect.value.toggleMenu()

function linuxDoLogin() {
  const clientId = settingStore.settings.linuxdoClientId
  const redirectUri = encodeURIComponent(settingStore.settings.linuxdoCallbackUrl)
  window.location.href =
      `https://connect.linux.do/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email`
}

linuxDoGetUser();
async function linuxDoGetUser() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (code) {
    oauthLoading.value = true
    oauthLinuxDoLogin(code).then(data => {
      bindForm.oauthUserId = data.userInfo.oauthUserId;
      if (!data.token) {
        showBindForm.value = true
        oauthLoading.value = false
        ElMessage({ message: '请注册绑定一个邮箱', type: 'warning', duration: 4000, plain: true })
        return;
      }
      saveToken(data.token);
    }).catch(() => { oauthLoading.value = false })
  }
  const cleanUrl = window.location.origin + window.location.pathname
  window.history.replaceState({}, '', cleanUrl)
}

function bind() {
  if (!bindForm.email) { ElMessage({ message: t('emptyEmailMsg'), type: 'error', plain: true }); return }
  if (bindForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({ message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}), type: 'error', plain: true })
    return
  }
  let email = bindForm.email + suffix.value;
  if (!isEmail(email)) { ElMessage({ message: t('notEmailMsg'), type: 'error', plain: true }); return }
  if (settingStore.settings.regKey === 0) {
    if (!bindForm.code) { ElMessage({ message: t('emptyRegKeyMsg'), type: 'error', plain: true }); return }
  }
  const form = {email: bindForm.email + suffix.value, oauthUserId: bindForm.oauthUserId, code: bindForm.code}
  bindLoading.value = true
  oauthBindUser(form).then(data => saveToken(data.token)).catch(() => { bindLoading.value = false })
}

// ========== 演示模式 Mock ==========
const DEMO_TOKEN = 'cuninbox-demo-token-' + Date.now();
function mockUserInfo() {
  return {
    account: { accountId: 10001, account: 'demo@cuninbox.ai', nickname: '演示用户', avatar: '', createTime: Date.now(), allReceive: 0 },
    user: { userId: 1, username: 'demo', email: 'demo@cuninbox.ai', name: '演示用户',
            role: { name: 'USER', id: 1, sendType: 'day', sendCount: 50, accountCount: 5 } },
    permKeys: ['email:query', 'email:send', 'identity:query', 'assistant:use', 'security:query',
               'setting:update', 'star:query', 'draft:query'],
    menus: []
  }
}
async function saveTokenDemo() {
  localStorage.setItem('token', DEMO_TOKEN)
  localStorage.setItem('cuninbox_demo', '1')
  const user = mockUserInfo()
  accountStore.currentAccountId = user.account.accountId;
  accountStore.currentAccount = user.account;
  userStore.user = user;
  try {
    const routers = permsToRouter(user.permKeys);
    routers.forEach(routerData => router.addRoute('layout', routerData));
  } catch (e) {}
  await router.replace({name: 'dashboard'})
  uiStore.showNotice()
  ElMessage({ message: '演示模式：数据为Mock，登录功能待后端启动后可真实使用', type: 'success', duration: 3500, plain: true })
}
function demoLogin() {
  loginLoading.value = true
  setTimeout(async () => {
    try { await saveTokenDemo() }
    finally { loginLoading.value = false }
  }, 300)
}

const submit = () => {
  if (!form.email) { ElMessage({ message: t('emptyEmailMsg'), type: 'error', plain: true }); return }
  let email = form.email + (settingStore.settings.loginDomain === 0 ? suffix.value : '');
  if (!isEmail(email)) { ElMessage({ message: t('notEmailMsg'), type: 'error', plain: true }); return }
  if (!form.password) { ElMessage({ message: t('emptyPwdMsg'), type: 'error', plain: true }); return }
  loginLoading.value = true
  login(email, form.password).then(async data => { await saveToken(data.token) })
    .catch(async () => {
      // 后端未启动 → 自动 fallback 演示模式
      ElMessage({ message: '后端未启动，已自动进入演示模式', type: 'warning', duration: 2500, plain: true })
      await saveTokenDemo()
    })
    .finally(() => { loginLoading.value = false })
}

async function saveToken(token) {
  localStorage.setItem('token', token)
  localStorage.removeItem('cuninbox_demo')
  let user;
  try {
    user = await loginUserInfo();
  } catch (e) {
    // 登录成功但取用户信息失败（例如跨域或后端状态不一致）→ demo兜底
    ElMessage({ message: '用户信息获取失败，进入演示模式', type: 'warning', duration: 2500, plain: true })
    return saveTokenDemo()
  }
  accountStore.currentAccountId = user.account.accountId;
  accountStore.currentAccount = user.account;
  userStore.user = user;
  const routers = permsToRouter(user.permKeys);
  routers.forEach(routerData => router.addRoute('layout', routerData));
  await router.replace({name: 'dashboard'})
  uiStore.showNotice()
  oauthLoading.value = false; bindLoading.value = false;
}

function submitRegister() {
  if (!registerForm.email) { ElMessage({ message: t('emptyEmailMsg'), type: 'error', plain: true }); return }
  if (registerForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({ message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}), type: 'error', plain: true })
    return
  }
  if (!isEmail(registerForm.email + suffix.value)) { ElMessage({ message: t('notEmailMsg'), type: 'error', plain: true }); return }
  if (!registerForm.password) { ElMessage({ message: t('emptyPwdMsg'), type: 'error', plain: true }); return }
  if (registerForm.password.length < 6) { ElMessage({ message: t('pwdLengthMsg'), type: 'error', plain: true }); return }
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage({ message: t('confirmPwdFailMsg'), type: 'error', plain: true }); return
  }
  if (settingStore.settings.regKey === 0) {
    if (!registerForm.code) { ElMessage({ message: t('emptyRegKeyMsg'), type: 'error', plain: true }); return }
  }
  if (!verifyToken && (settingStore.settings.registerVerify === 0 || (settingStore.settings.registerVerify === 2 && settingStore.settings.regVerifyOpen))) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try { turnstileId = window.turnstile.render('.register-turnstile') }
          catch (e) { botJsError.value = true }
        } else { window.turnstile.reset('.register-turnstile') }
      })
    } else if (!botJsError.value) {
      ElMessage({ message: t('botVerifyMsg'), type: "error", plain: true })
    }
    return;
  }
  registerLoading.value = true
  const form = {
    email: registerForm.email + suffix.value,
    password: registerForm.password,
    token: verifyToken,
    code: registerForm.code
  }
  register(form).then(({regVerifyOpen}) => {
    show.value = 'login'
    registerForm.email = ''; registerForm.password = '';
    registerForm.confirmPassword = ''; registerForm.code = ''
    registerLoading.value = false; verifyToken = '';
    settingStore.settings.regVerifyOpen = regVerifyOpen; verifyShow.value = false
    ElMessage({ message: t('regSuccessMsg'), type: 'success', plain: true })
  }).catch(res => {
    registerLoading.value = false
    if (res.code === 400) {
      verifyToken = ''; settingStore.settings.regVerifyOpen = true
      if (turnstileId) window.turnstile.reset(turnstileId)
      else nextTick(() => { turnstileId = window.turnstile.render('.register-turnstile') })
      verifyShow.value = true
    }
  });
}

// 粒子装饰的 style 生成器
function particleStyle(i) {
  const size = (i % 3) + 1;
  const top = ((i * 53) % 95) + '%';
  const left = ((i * 37 + 11) % 95) + '%';
  const delay = (i * 0.3) % 4 + 's';
  const dur = 4 + ((i * 11) % 5) + 's';
  const color = ['#00e5ff', '#3d7cff', '#8b5cf6'][i % 3];
  return {
    width: size + 'px',
    height: size + 'px',
    top, left,
    '--p-color': color,
    animationDelay: delay,
    animationDuration: dur,
  }
}
</script>

<style>
.el-select-dropdown__item { padding: 0 15px; }
.no-autofill-pwd .el-input__inner { -webkit-text-security: disc !important; }
</style>

<style lang="scss" scoped>
/* ============ 背景 ============ */
#login-box {
  position: fixed;
  inset: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: #070b17;
}

.ci-login-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.ci-login-bg__nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: .55;
  pointer-events: none;
}
.ci-login-bg__nebula--1 {
  width: 520px; height: 520px;
  background: radial-gradient(circle, rgba(0,229,255,.35), transparent 60%);
  top: -140px; left: -120px;
  animation: ci-breathe 12s ease-in-out infinite;
}
.ci-login-bg__nebula--2 {
  width: 620px; height: 620px;
  background: radial-gradient(circle, rgba(139,92,246,.30), transparent 60%);
  bottom: -180px; right: -140px;
  animation: ci-breathe 15s ease-in-out infinite 2s;
}
.ci-login-bg__nebula--3 {
  width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(61,124,255,.28), transparent 60%);
  top: 45%; left: 55%;
  transform: translate(-50%, -50%);
  animation: ci-breathe 18s ease-in-out infinite 4s;
}

.ci-login-bg__grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(0, 229, 255, .05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, .05) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,.7), transparent 75%);
}

.ci-login-bg__particles {
  position: absolute; inset: 0;
}
.ci-login-bg__dot {
  position: absolute;
  background: var(--p-color, #00e5ff);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--p-color, #00e5ff);
  animation: ci-particle 4s ease-in-out infinite;
}
@keyframes ci-particle {
  0%, 100% { opacity: .15; transform: translateY(0); }
  50%      { opacity: 1;   transform: translateY(-12px); }
}

/* ============ 登录卡片（普通居中样式 + 自动扫光） ============ */
.ci-login-card {
  position: relative;
  z-index: 2;
  width: min(420px, calc(100vw - 40px));
  padding: 38px 36px 26px;
  border-radius: 14px;
  background: rgba(15, 23, 43, 0.72);
  -webkit-backdrop-filter: saturate(160%) blur(22px);
  backdrop-filter: saturate(160%) blur(22px);
  border: 1px solid rgba(0, 229, 255, 0.16);
  box-shadow:
    0 24px 64px rgba(0, 0, 0, .55),
    0 0 24px rgba(0, 229, 255, .06);
  animation: ci-float-up .6s ease both;
}

.ci-login-card__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 26px;
  text-align: center;

  .ci-login-card__tagline {
    font-size: 12.5px;
    letter-spacing: .4px;
    color: #94a3b8;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(0, 229, 255, 0.06);
    border: 1px solid rgba(0, 229, 255, 0.14);
  }
  .ci-login-card__title {
    margin-top: 2px;
    color: #cbd5e1;
    font-size: 13px;
  }
}

.ci-login-card__body {
  display: flex;
  flex-direction: column;
}

/* ============ 输入组（包一层做底部聚焦扫光线） ============ */
.ci-input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
  padding-bottom: 12px;
}

.ci-input-label {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  color: #94a3b8;
  margin-bottom: 7px;
  font-weight: 500;
}

.ci-login-card .el-input {
  width: 100%;
}

/* 登录/注册按钮 */
.ci-btn-submit {
  width: 100%;
  height: 42px;
  border-radius: 10px;
  margin-top: 12px;
  font-size: 14.5px;
  letter-spacing: 1px;
}

.ci-btn-linuxdo {
  width: 100%;
  height: 40px;
  margin-top: 12px;
  border-radius: 10px;
  border-color: rgba(255, 255, 255, .1);
}

/* 域名下拉框 */
.ci-domain-select {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #00e5ff;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  padding-right: 4px;
  cursor: pointer;
  &__icon { color: #5a6d8a; }
}

.select {
  position: absolute;
  right: 30px;
  width: 100px;
  opacity: 0;
  pointer-events: none;
}

/* ============ 底部 ============ */
.ci-login-card__footer {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid rgba(26, 39, 68, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.ci-switch {
  font-size: 13px;
  color: #94a3b8;
  cursor: pointer;
  user-select: none;
  span {
    color: #00e5ff;
    margin-left: 4px;
    font-weight: 600;
    &:hover { text-shadow: 0 0 8px rgba(0,229,255,.5); }
  }
}

.ci-copyright {
  display: inline-flex;
  align-items: center;
  font-size: 11.5px;
  color: #5a6d8a;
  margin-top: 2px;
}

/* 演示模式入口 */
.ci-demo-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  color: var(--ci-text-3);
  font-size: 12px;
  font-family: var(--ci-font-mono);
  letter-spacing: .3px;
  opacity: .9;
  &__line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--ci-border), transparent);
  }
  &__btn {
    padding: 2px 4px;
    font-size: 12px;
    letter-spacing: .3px;
    color: var(--ci-cyan) !important;
    text-shadow: 0 0 6px rgba(0,229,255,.3);
    &:hover { text-shadow: 0 0 10px rgba(0,229,255,.6); }
  }
}

.ci-warn {
  color: #ff6b6b;
  font-size: 12px;
}

/* GitHub 链接 */
.ci-github {
  position: fixed;
  top: 20px; right: 20px;
  width: 38px; height: 38px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  z-index: 10;
  color: #94a3b8;
  background: rgba(15, 23, 43, .6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.18);
  transition: all .2s ease;
  &:hover {
    color: #00e5ff;
    border-color: rgba(0, 229, 255, 0.5);
    box-shadow: 0 0 0 3px rgba(0, 229, 255, .1), 0 0 16px rgba(0,229,255,.25);
    transform: translateY(-1px);
  }
}

/* ============ 弹框 ============ */
:deep(.bind-dialog) {
  width: 420px !important;
  @media (max-width: 440px) {
    width: calc(100% - 40px) !important;
    margin-right: 20px !important;
    margin-left: 20px !important;
  }
}
.bind-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}
.setting-icon { position: relative; top: 6px; }

:deep(.el-input-group__append) {
  padding: 0 8px 0 8px !important;
  background: var(--ci-bg-elev) !important;
  border-radius: 0 8px 8px 0;
  border-color: var(--ci-border-strong) !important;
}

:deep(.el-button+.el-button) { margin: 0; }

.register-turnstile { margin-bottom: 16px; }

@keyframes ci-float-up {
  0%   { opacity: 0; transform: translateY(22px) scale(.98); }
  100% { opacity: 1; transform: translateY(0)    scale(1); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ci-login-card {
    padding: 32px 22px 22px;
    border-radius: 16px;
  }
  .ci-login-bg__nebula {
    filter: blur(70px);
  }
}
</style>
