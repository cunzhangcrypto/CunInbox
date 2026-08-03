<template>
  <div
    class="ci-logo"
    :class="[
      `ci-logo--${size}`,
      { 'ci-logo--animated': animated, 'ci-logo--light': light }
    ]"
    :style="customStyle"
  >
    <img
      :src="logoUrl"
      class="ci-logo__img"
      :width="size === 'lg' ? 64 : size === 'md' ? 44 : 36"
      :height="size === 'lg' ? 64 : size === 'md' ? 44 : 36"
      alt="CunInbox Logo"
    />
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

const logoUrl = '/ci-logo.png'
const customStyle = computed(() => ({}))
</script>

<style lang="scss" scoped>
.ci-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  line-height: 1;
  user-select: none;

  .ci-logo__img {
    display: block;
    flex-shrink: 0;
    object-fit: contain;
    transform-origin: center;
  }

  /* 动画：只在 animated=true 时启用，轻微呼吸 */
  &--animated .ci-logo__img {
    animation: ci-breath 4s ease-in-out infinite;
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

@keyframes ci-breath {
  0%, 100% { transform: scale(1);    filter: drop-shadow(0 0 1px currentColor); }
  50%      { transform: scale(1.03); filter: drop-shadow(0 0 6px rgba(0,229,255,0.5)); }
}
</style>
