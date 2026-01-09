<template>
  <div class="w-[80%] h-full mx-auto p-8 overflow-y-auto">
    <h1 class="text-3xl font-bold mb-8">应用设置</h1>

    <div class="space-y-6">
      <!-- 语言设置 -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">语言设置</h2>
        <div class="flex items-center gap-4">
          <label class="text-gray-700 font-medium">当前语言：</label>
          <select
            v-model="selectedLanguage"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
              focus:ring-cyan-500"
            @change="handleLanguageChange"
          >
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
      </div>

      <!-- 字体大小设置 -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">字体大小</h2>
        <div class="flex items-center gap-4">
          <label class="text-gray-700 font-medium">字体大小：</label>
          <input
            v-model.number="selectedFontSize"
            type="range"
            min="12"
            max="24"
            step="1"
            class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            @input="handleFontSizeChange"
          />
          <span class="text-gray-700 font-medium min-w-[60px]">{{ selectedFontSize }}px</span>
        </div>
        <div class="mt-4 p-4 bg-gray-50 rounded-md">
          <p :style="{ fontSize: selectedFontSize + 'px' }" class="text-gray-700">
            这是字体大小预览效果。当前字体大小为 {{ selectedFontSize }}px。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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
