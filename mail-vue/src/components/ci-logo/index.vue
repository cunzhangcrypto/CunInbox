<template>
  <div
    class="ci-logo"
    :class="[
      `ci-logo--${size}`,
      { 'ci-logo--animated': animated, 'ci-logo--light': light }
    ]"
    :style="customStyle"
  >
    <svg
      :width="size === 'lg' ? 64 : size === 'md' ? 44 : 36"
      :height="size === 'lg' ? 64 : size === 'md' ? 44 : 36"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ciLogoStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#00e5ff"/>
          <stop offset="100%" stop-color="#8b5cf6"/>
        </linearGradient>
        <linearGradient id="ciLogoFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00e5ff" stop-opacity=".22"/>
          <stop offset="100%" stop-color="#3d7cff" stop-opacity=".06"/>
        </linearGradient>
        <filter id="ciGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 外环 -->
      <circle
        cx="32" cy="32" r="30"
        fill="url(#ciLogoFill)"
        stroke="url(#ciLogoStroke)"
        stroke-width="1.5"
        filter="url(#ciGlow)"
        class="ci-logo__ring"
      />

      <!-- 字母 "C" + "I" 融合成邮箱信封 -->
      <g filter="url(#ciGlow)" class="ci-logo__mark">
        <!-- 信封左侧弧 = "C" -->
        <path
          d="M18 20 C12 20 10 26 10 32 C10 38 12 44 18 44
             L22 44 L22 40 L18 40 C14 40 14 36 14 32
             C14 28 14 24 18 24 Z"
          fill="url(#ciLogoStroke)"
        />
        <!-- 信封右侧 = "I" 的形状 + 信封封盖 -->
        <path
          d="M44 20 C46.5 20 48 21.5 48 24 L48 40
             C48 42.5 46.5 44 44 44 L40 44 L40 40 L44 40
             L44 24 L40 24 L40 20 Z"
          fill="url(#ciLogoStroke)"
        />
        <!-- 信封中间水平横梁（收件箱 Inbox 的槽） -->
        <rect x="22" y="30" width="20" height="2.4" rx="1.2" fill="url(#ciLogoStroke)"/>
        <!-- 信封三角封盖 -->
        <path
          d="M12 21 L32 33 L52 21 L48 18 L32 30 L16 18 Z"
          fill="none"
          stroke="url(#ciLogoStroke)"
          stroke-width="1.4"
          stroke-linejoin="round"
          opacity=".95"
        />
      </g>

      <!-- 右侧发光粒子（强调"I"的数字身份意味） -->
      <circle cx="52" cy="18" r="1.8" fill="#8b5cf6" class="ci-logo__p1"/>
      <circle cx="54" cy="14" r="1"   fill="#00e5ff" class="ci-logo__p2"/>
      <circle cx="50" cy="11" r="1.2" fill="#3d7cff" class="ci-logo__p3"/>
    </svg>
    <span v-if="showText" class="ci-logo__text" :class="{'ci-logo__text--light': light}">
      <em>Cun</em>Inbox
    </span>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  size: {type: String, default: 'md'},   // sm | md | lg
  showText: {type: Boolean, default: true},
  animated: {type: Boolean, default: true},
  light: {type: Boolean, default: false}
})

const customStyle = computed(() => ({}))
</script>

<style lang="scss" scoped>
.ci-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  line-height: 1;
  user-select: none;

  svg {
    display: block;
    flex-shrink: 0;
  }

  &__ring {
    transform-origin: center;
  }
  &__mark {
    transform-origin: center;
  }

  /* 粒子 */
  &__p1, &__p2, &__p3 {
    transform-origin: center;
    opacity: .85;
  }

  /* 动画：只在 animated=true 时启用 */
  &--animated {
    .ci-logo__ring {
      animation: ci-ring 6s ease-in-out infinite;
    }
    .ci-logo__mark {
      animation: ci-breath 3.6s ease-in-out infinite;
    }
    .ci-logo__p1 { animation: ci-dot 2.8s ease-in-out infinite; }
    .ci-logo__p2 { animation: ci-dot 2.8s ease-in-out infinite .5s; }
    .ci-logo__p3 { animation: ci-dot 2.8s ease-in-out infinite 1s; }
  }

  &__text {
    font-weight: 800;
    letter-spacing: .5px;
    font-size: 18px;
    color: #e5edff;
    em {
      font-style: normal;
      background: linear-gradient(90deg, #00e5ff, #8b5cf6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    &--light {
      color: #0a0e1a;
    }
  }

  &--sm .ci-logo__text { font-size: 15px; }
  &--md .ci-logo__text { font-size: 17px; }
  &--lg .ci-logo__text { font-size: 22px; letter-spacing: .8px; }
}

@keyframes ci-ring {
  0%, 100% { transform: rotate(0deg) scale(1);   opacity: .9; }
  50%      { transform: rotate(180deg) scale(1.02); opacity: 1; }
}
@keyframes ci-breath {
  0%, 100% { transform: scale(1);    filter: drop-shadow(0 0 1px currentColor); }
  50%      { transform: scale(1.03); filter: drop-shadow(0 0 6px rgba(0,229,255,0.5)); }
}
@keyframes ci-dot {
  0%, 100% { transform: scale(1); opacity: .6; }
  50%      { transform: scale(1.5); opacity: 1; }
}
</style>
