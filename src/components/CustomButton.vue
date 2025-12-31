<template>
  <button
    class="shadow-sm inline-flex justify-center items-center rounded-md disabled:opacity-50
      disabled:pointer-events-none"
    :class="['', sizeClass, colorClass]"
    :disabled="disabled || loading"
    :loading="loading"
  >
    <!-- <Icon icon="radix-icons:chat-bubble" class="mr-2"></Icon>
    新建聊天 -->
    <Icon v-if="iconWithLoading" :icon="iconWithLoading" class="mr-2" />
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
export type ButtonType = 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warning';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor = 'cyan' | 'pink';
export type ButtonPlain = { plain: string; normal: string };

export interface CustomButtonProps {
  size?: ButtonSize;
  color?: ButtonColor;
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}
defineOptions({
  name: 'CustomButton',
});
const props = withDefaults(defineProps<CustomButtonProps>(), {
  color: 'cyan',
  size: 'medium',
  icon: '',
});
const colorVariants: Record<ButtonColor, { plain: string; normal: string }> = {
  cyan: {
    plain: 'bg-cyan-100 hover:bg-cyan-700 border border-cyan-700 hover:text-white',
    normal: 'bg-cyan-700 text-white hover:bg-cyan-100 hover:text-cyan-700 border border-cyan-700',
  },
  pink: {
    plain: 'bg-pink-100 hover:bg-pink-700 border border-pink-700 hover:text-white',
    normal: 'bg-pink-700 text-white hover:bg-pink-100 hover:text-pink-700 border border-pink-700 ',
  },
};
const iconWithLoading = computed(() => {
  if (props.loading) {
    return 'line-md:loading-loop';
  } else {
    return props.icon;
  }
});
const colorClass = computed(() => {
  if (props.plain) {
    return colorVariants[props.color].plain;
  } else {
    return colorVariants[props.color].normal;
  }
});
const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'h-8 px-2 py-1 text-sm rounded-md';
    case 'medium':
      return 'h-10 px-4 py-2 text-base rounded-md';
    case 'large':
      return 'h-12 px-6 py-3 text-lg rounded-md';
    default:
      return 'h-10 px-4 py-2 text-base rounded-md';
  }
});
</script>
