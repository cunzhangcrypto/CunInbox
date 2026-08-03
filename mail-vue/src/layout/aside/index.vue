<template>
  <el-scrollbar class="scroll ci-shimmer-auto">
    <div class="aside-inner">
      <!-- 顶部 Logo 区 -->
      <div class="ci-aside-header">
        <CiLogo size="md" :animated="true" :showText="true"/>
        <!-- AI 呼吸灯状态指示 -->
        <div class="ci-ai-badge">
          <span class="ci-ai-badge__dot"></span>
          <span>AI Online</span>
        </div>
      </div>
      <el-menu :collapse="false" text-color="#94a3b8" active-text-color="#00e5ff" style="margin-top: 6px">
        <el-menu-item @click="router.push({name: 'dashboard'})" index="dashboard"
                      :class="route.meta.name === 'dashboard' ? 'choose-item' : ''">
          <Icon icon="mdi:view-dashboard-outline" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('dashboard')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'email'})" index="email"
                      :class="route.meta.name === 'email' ? 'choose-item' : ''">
          <Icon icon="hugeicons:mailbox-01" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('inbox')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'identity'})" index="identity"
                      :class="route.meta.name === 'identity' ? 'choose-item' : ''">
          <Icon icon="mdi:account-key-outline" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('identityCenter')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'assistant'})" index="assistant"
                      :class="route.meta.name === 'assistant' ? 'choose-item' : ''">
          <Icon icon="mdi:robot-outline" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('aiAssistant')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'security'})" index="security"
                      :class="route.meta.name === 'security' ? 'choose-item' : ''">
          <Icon icon="mdi:shield-check-outline" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('securityCenter')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'send'})" index="send" v-perm="'email:send'"
                      :class="route.meta.name === 'send' ? 'choose-item' : ''">
          <Icon icon="cil:send" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('sent')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'draft'})" index="draft" v-perm="'email:send'"
                      :class="route.meta.name === 'draft' ? 'choose-item' : ''">
          <Icon icon="ep:document" width="19" height="19" />
          <span class="menu-name" style="margin-left: 22px">{{$t('drafts')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'star'})" index="star"
                      :class="route.meta.name === 'star' ? 'choose-item' : ''">
          <Icon icon="solar:star-line-duotone" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('starred')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'setting'})" index="setting"
                      :class="route.meta.name === 'setting' ? 'choose-item' : ''">
          <Icon icon="fluent:settings-48-regular" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('settings')}}</span>
        </el-menu-item>
        <div class="ci-menu-divider" v-perm="['all-email:query','user:query','role:query','setting:query','analysis:query','reg-key:query']">
          <span></span>
          <div>{{$t('manage')}}</div>
          <span></span>
        </div>
        <el-menu-item @click="router.push({name: 'analysis'})" index="analysis" v-perm="'analysis:query'"
                      :class="route.meta.name === 'analysis' ? 'choose-item' : ''">
          <Icon icon="fluent:data-pie-20-regular" width="24" height="24" />
          <span class="menu-name" style="margin-left: 18px">{{$t('analytics')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'user'})" index="setting" v-perm="'user:query'"
                      :class="route.meta.name === 'user' ? 'choose-item' : ''">
          <Icon icon="si:user-alt-2-line" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('allUsers')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'all-email'})" index="all-email" v-perm="'all-email:query'"
                      :class="route.meta.name === 'all-email' ? 'choose-item' : ''">
          <Icon icon="fluent:mail-list-28-regular" width="22" height="22" />
          <span class="menu-name" style="margin-left: 20px">{{$t('allMail')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'role'})" index="setting" v-perm="'role:query'"
                      :class="route.meta.name === 'role' ? 'choose-item' : ''">
          <Icon icon="fluent:lock-closed-16-regular" width="22" height="22" />
          <span class="menu-name" style="margin-left: 20px">{{$t('permissions')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'reg-key'})" index="reg-key" v-perm="'reg-key:query'"
                      :class="route.meta.name === 'reg-key' ? 'choose-item' : ''">
          <Icon icon="fluent:fingerprint-20-filled" width="22" height="22" />
          <span class="menu-name" style="margin-left: 20px">{{$t('inviteCode')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'sys-setting'})" index="sys-setting" v-perm="'setting:query'"
                      :class="route.meta.name === 'sys-setting' ? 'choose-item' : ''">
          <Icon icon="eos-icons:system-ok-outlined" width="18" height="18" style="margin-left: 2px" />
          <span class="menu-name" style="margin-left: 22px">{{$t('SystemSettings')}}</span>
        </el-menu-item>
      </el-menu>

      <!-- 演示模式标识 -->
      <div class="ci-demo-badge" v-if="isDemo">
        <div class="ci-demo-badge__info">
          <Icon icon="mdi:flask-outline" width="16" height="16" />
          <span>演示模式</span>
        </div>
        <div class="ci-demo-badge__hint">数据为预设示例</div>
        <div class="ci-demo-badge__exit" v-if="!isDemoBuild" @click="exitDemo">退出演示</div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import router from "@/router/index.js";
import { useRoute } from "vue-router";
import {Icon} from "@iconify/vue";
import {useSettingStore} from "@/store/setting.js";
import CiLogo from "@/components/ci-logo/index.vue";
import {computed} from "vue";

const settingStore = useSettingStore();
const route = useRoute();

// 演示构建（build:demo）：纯静态演示站，无退出按钮
const isDemoBuild = import.meta.env.VITE_DEMO_MODE === 'true'
const isDemo = computed(() => isDemoBuild || localStorage.getItem('cuninbox_demo') === '1')

function exitDemo() {
  localStorage.removeItem('cuninbox_demo')
  localStorage.removeItem('token')
  location.reload()
}
</script>

<style lang="scss" scoped>

/* 整个侧边栏：深色玻璃 + 自动扫光 */
.scroll {
  height: 100%;
  background: linear-gradient(180deg, #0d1428 0%, #0a0e1a 100%);
  border-right: 1px solid rgba(0, 229, 255, 0.12);
  position: relative;
  overflow: hidden;
  :deep(.el-scrollbar__wrap--hidden-default) {
    background: transparent !important;
  }
}

.aside-inner {
  padding: 18px 12px 24px;
  min-height: 100%;
}

/* ========== 顶部 Logo 区 ========== */
.ci-aside-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 6px 8px 18px;
  margin: 0 4px 10px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.12);
  position: relative;
}
/* 底部霓虹下划线 */
.ci-aside-header::after {
  content: "";
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: -1px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, var(--ci-cyan), var(--ci-purple), transparent);
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
  animation: ci-line-breathe 4s ease-in-out infinite;
}
@keyframes ci-line-breathe {
  0%, 100% { opacity: .6; }
  50%      { opacity: 1; }
}

/* AI 呼吸灯徽章 */
.ci-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.25);
  font-size: 11px;
  color: var(--ci-purple);
  letter-spacing: .5px;
  font-family: var(--ci-font-mono);
  &__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--ci-purple);
    box-shadow: 0 0 8px var(--ci-purple);
    animation: ci-throb 2.2s ease-in-out infinite;
  }
}

/* ========== 菜单分隔线（管理） ========== */
.ci-menu-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 18px 18px 8px;
  color: var(--ci-text-3);
  font-size: 11.5px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: .8;
  span {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--ci-border), transparent);
  }
}

/* ========== 菜单项 ========== */
.el-menu {
  border-right: 0 !important;
  width: 100%;
  background: transparent !important;
  :deep(.el-menu-item) {
    background: transparent;
    margin: 4px 8px !important;
    border-radius: 8px;
    height: 40px;
    padding: 0 14px !important;
    transition: all .2s ease;
    position: relative;
    overflow: hidden;
    color: var(--ci-text-2);
    &::before {
      content: "";
      position: absolute;
      left: 0; top: 0;
      width: 0; height: 100%;
      background: linear-gradient(90deg, var(--ci-cyan-05), transparent);
      transition: width .3s ease;
    }
  }
  :deep(.el-menu-item:hover) {
    color: var(--ci-cyan) !important;
    background: rgba(0, 229, 255, 0.05) !important;
    &::before { width: 100%; }
  }
}

.menu-name {
  user-select: none;
  font-size: 13.5px;
}

/* 选中项 */
.choose-item {
  color: var(--ci-cyan) !important;
  font-weight: 600;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.14), rgba(0, 229, 255, 0.02)) !important;
  :deep(.el-icon) {
    filter: drop-shadow(0 0 4px rgba(0,229,255,.4));
  }
  /* 左侧霓虹条 */
  &::after {
    content: "";
    position: absolute;
    left: 0; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 20px;
    border-radius: 2px;
    background: linear-gradient(180deg, var(--ci-cyan), var(--ci-purple));
    box-shadow: 0 0 8px rgba(0,229,255,.5);
  }
}

:deep(.el-divider__text) {
  background: transparent;
  color: var(--ci-text-3);
}

/* ========== 演示模式标识 ========== */
.ci-demo-badge {
  margin: 20px 12px 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(0, 229, 255, 0.05));
  border: 1px solid rgba(139, 92, 246, 0.2);
  text-align: center;

  &__info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--ci-purple);
    font-family: var(--ci-font-mono);
  }
  &__hint {
    font-size: 11px;
    color: var(--ci-text-3);
    margin: 4px 0 8px;
  }
  &__exit {
    font-size: 12px;
    color: var(--ci-cyan);
    cursor: pointer;
    padding: 4px 0;
    border-top: 1px solid rgba(0, 229, 255, 0.1);
    transition: color .2s;
    &:hover {
      color: #fff;
    }
  }
}

/* 移动端宽度适配 */
@media (max-width: 1025px) {
  :deep(.el-menu) {
    width: 260px;
  }
}
</style>
