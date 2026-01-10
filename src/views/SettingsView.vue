<template>
  <div class="w-[80%] h-full mx-auto p-8 overflow-y-auto">
    <h1 class="text-3xl font-bold mb-8">{{ $t('settings.title') }}</h1>

    <div class="space-y-6">
      <!-- 语言设置 -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">{{ $t('settings.language.title') }}</h2>
        <div class="flex items-center gap-4">
          <label class="text-gray-700 font-medium">
            {{ $t('settings.language.currentLanguage') }}
          </label>
          <SelectRoot v-model="selectedLanguage" @update:model-value="handleLanguageChange">
            <SelectTrigger
              class="flex w-[200px] justify-between border border-gray-300 items-center py-2 px-3
                rounded-md shadow-sm data-[placeholder]:text-gray-400 focus:outline-none
                focus:ring-2 focus:ring-cyan-500"
            >
              <SelectValue :placeholder="$t('settings.language.selectLanguage')" />
              <Icon icon="radix-icons:chevron-down" class="w-4 h-4" />
            </SelectTrigger>
            <SelectPortal>
              <SelectContent class="bg-white rounded-md shadow-md z-[100] border border-gray-300">
                <SelectViewport>
                  <SelectItem
                    value="zh-CN"
                    class="flex outline-none items-center h-8 px-6 rounded text-gray-700
                      cursor-pointer relative data-[highlighted]:bg-cyan-100
                      data-[highlighted]:text-cyan-700"
                  >
                    <SelectItemIndicator class="absolute left-2">
                      <Icon icon="radix-icons:check" width="15" height="15" />
                    </SelectItemIndicator>
                    <SelectItemText>{{ $t('settings.language.zhCN') }}</SelectItemText>
                  </SelectItem>
                  <SelectItem
                    value="en-US"
                    class="flex outline-none items-center h-8 px-6 rounded text-gray-700
                      cursor-pointer relative data-[highlighted]:bg-cyan-100
                      data-[highlighted]:text-cyan-700"
                  >
                    <SelectItemIndicator class="absolute left-2">
                      <Icon icon="radix-icons:check" width="15" height="15" />
                    </SelectItemIndicator>
                    <SelectItemText>{{ $t('settings.language.enUS') }}</SelectItemText>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>
      </div>

      <!-- 字体大小设置 -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">{{ $t('settings.fontSize.title') }}</h2>
        <div class="flex items-center gap-4">
          <label class="text-gray-700 font-medium">{{ $t('settings.fontSize.label') }}</label>
          <NumberFieldRoot
            v-model="selectedFontSize"
            :min="12"
            :max="24"
            :step="1"
            class="flex items-center gap-2"
            @update:model-value="handleFontSizeChange"
          >
            <NumberFieldDecrement
              class="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md
                hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2
                focus:ring-cyan-500"
            >
              <Icon icon="radix-icons:dash" class="w-4 h-4" />
            </NumberFieldDecrement>
            <NumberFieldInput
              class="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none
                focus:ring-2 focus:ring-cyan-500"
            />
            <NumberFieldIncrement
              class="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md
                hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2
                focus:ring-cyan-500"
            >
              <Icon icon="radix-icons:plus" class="w-4 h-4" />
            </NumberFieldIncrement>
          </NumberFieldRoot>
          <span class="text-gray-500 text-sm">px</span>
        </div>
        <div class="mt-4 p-4 bg-gray-50 rounded-md">
          <p :style="{ fontSize: selectedFontSize + 'px' }" class="text-gray-700">
            {{ $t('settings.fontSize.preview', { size: selectedFontSize }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from 'radix-vue';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore();

const selectedLanguage = ref('zh-CN');
const selectedFontSize = ref(14);

// 加载设置
onMounted(async () => {
  await settingsStore.fetchSettings();
  if (settingsStore.settings) {
    selectedLanguage.value = settingsStore.settings.language;
    selectedFontSize.value = settingsStore.settings.fontSize;
  }
});

// 监听设置变化
watch(
  () => settingsStore.settings,
  (newSettings) => {
    if (newSettings) {
      selectedLanguage.value = newSettings.language;
      selectedFontSize.value = newSettings.fontSize;
    }
  }
);

// 处理语言变更
const handleLanguageChange = async () => {
  await settingsStore.setLanguage(selectedLanguage.value);
};

// 处理字体大小变更
const handleFontSizeChange = async () => {
  await settingsStore.setFontSize(selectedFontSize.value);
};
</script>
