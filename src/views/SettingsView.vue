<template>
  <div class="w-[80%] h-full mx-auto p-8 overflow-y-auto">
    <h1 class="text-3xl font-bold mb-8">{{ $t('settings.title') }}</h1>

    <TabsRoot v-model="activeTab" class="w-full">
      <TabsList class="flex gap-2 mb-6 border-b border-gray-200">
        <TabsTrigger
          value="general"
          class="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent
            data-[state=active]:text-cyan-600 data-[state=active]:border-cyan-600
            hover:text-gray-800 transition-colors"
        >
          {{ $t('settings.general') }}
        </TabsTrigger>
        <TabsTrigger
          value="modelApi"
          class="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent
            data-[state=active]:text-cyan-600 data-[state=active]:border-cyan-600
            hover:text-gray-800 transition-colors"
        >
          {{ $t('settings.modelApi.tabLabel') }}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="space-y-6">
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
                class="w-20 px-3 py-2 border border-gray-300 rounded-md text-center
                  focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
      </TabsContent>

      <TabsContent value="modelApi" class="space-y-4">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 class="text-xl font-semibold mb-4">{{ $t('settings.modelApi.title') }}</h2>
          <AccordionRoot v-model="openAccordions" type="multiple" class="space-y-2">
            <AccordionItem
              v-for="provider in providers"
              :key="provider.name"
              :value="provider.name"
              class="border border-gray-200 rounded-md overflow-hidden"
            >
              <AccordionHeader>
                <AccordionTrigger
                  class="flex w-full items-center justify-between px-4 py-3 bg-gray-50
                    hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <span class="font-medium text-gray-900">
                      {{ $t(`settings.modelApi.providers.${provider.name}`) }}
                    </span>
                  </div>
                  <Icon
                    icon="radix-icons:chevron-down"
                    class="w-4 h-4 text-gray-500 transition-transform data-[state=open]:rotate-180"
                  />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent class="px-4 py-4 bg-white">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('settings.modelApi.apiKey') }}
                    </label>
                    <input
                      v-model="modelConfigs[provider.name].apiKey"
                      type="password"
                      :placeholder="$t('settings.modelApi.apiKeyPlaceholder')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('settings.modelApi.baseURL') }}
                    </label>
                    <input
                      v-model="modelConfigs[provider.name].baseURL"
                      type="text"
                      :placeholder="$t('settings.modelApi.baseURLPlaceholder')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none
                        focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div class="flex justify-end">
                    <button
                      :disabled="saveStatus[provider.name] === 'saving'"
                      class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700
                        disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      @click="saveModelConfig(provider.name)"
                    >
                      {{
                        saveStatus[provider.name] === 'saved'
                          ? $t('settings.modelApi.saved')
                          : $t('settings.modelApi.save')
                      }}
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </div>
      </TabsContent>
    </TabsRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
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
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from 'radix-vue';
import { ModelApiConfig, AppSettings } from '../types';
import { setLocale } from '../i18n';

const selectedLanguage = ref('zh-CN');
const selectedFontSize = ref(14);
const activeTab = ref('general');
const openAccordions = ref<string[]>([]);

// 支持的模型提供者
const providers = [
  { name: 'qwen', title: '通义千问' },
  { name: 'ernie', title: '文心一言' },
  { name: 'deepseek', title: '深度求索' },
];

// 模型配置状态
const modelConfigs = reactive<Record<string, ModelApiConfig>>({
  qwen: { providerName: 'qwen', apiKey: '', baseURL: '' },
  ernie: { providerName: 'ernie', apiKey: '', baseURL: '' },
  deepseek: { providerName: 'deepseek', apiKey: '', baseURL: '' },
});

// 保存状态
const saveStatus = reactive<Record<string, 'idle' | 'saving' | 'saved'>>({
  qwen: 'idle',
  ernie: 'idle',
  deepseek: 'idle',
});

// 当前设置
const currentSettings = ref<Omit<AppSettings, 'id'> | null>(null);

// 加载设置
onMounted(async () => {
  try {
    // 读取设置
    const settings = await window.electronAPI.readSettings();
    currentSettings.value = settings;
    selectedLanguage.value = settings.language || 'zh-CN';
    selectedFontSize.value = settings.fontSize || 14;

    // 同步 i18n 语言
    if (settings.language && (settings.language === 'zh-CN' || settings.language === 'en-US')) {
      setLocale(settings.language);
    }

    // 加载模型 API 配置
    const configs = await window.electronAPI.getProvidersConfigs();
    providers.forEach((provider) => {
      if (configs[provider.name]) {
        modelConfigs[provider.name] = { ...configs[provider.name] };
      }
    });
  } catch (error) {
    console.error('加载设置失败:', error);
  }
});

// 处理语言变更
const handleLanguageChange = async () => {
  try {
    if (!currentSettings.value) {
      currentSettings.value = {
        language: 'zh-CN',
        fontSize: 14,
        modelApiConfigs: [],
      };
    }
    // 创建纯 JavaScript 对象，确保可序列化
    const updated: Omit<AppSettings, 'id'> = {
      language: selectedLanguage.value,
      fontSize: currentSettings.value.fontSize || 14,
      modelApiConfigs:
        currentSettings.value.modelApiConfigs?.map((c) => ({
          providerName: c.providerName,
          apiKey: c.apiKey,
          baseURL: c.baseURL,
        })) || [],
    };
    await window.electronAPI.writeSettings(updated);
    currentSettings.value = updated;
    setLocale(selectedLanguage.value as 'zh-CN' | 'en-US');
  } catch (error) {
    console.error('保存语言设置失败:', error);
  }
};

// 处理字体大小变更
const handleFontSizeChange = async () => {
  try {
    if (!currentSettings.value) {
      currentSettings.value = {
        language: 'zh-CN',
        fontSize: 14,
        modelApiConfigs: [],
      };
    }
    // 创建纯 JavaScript 对象，确保可序列化
    const updated: Omit<AppSettings, 'id'> = {
      language: currentSettings.value.language || 'zh-CN',
      fontSize: selectedFontSize.value,
      modelApiConfigs:
        currentSettings.value.modelApiConfigs?.map((c) => ({
          providerName: c.providerName,
          apiKey: c.apiKey,
          baseURL: c.baseURL,
        })) || [],
    };
    await window.electronAPI.writeSettings(updated);
    currentSettings.value = updated;
  } catch (error) {
    console.error('保存字体大小设置失败:', error);
  }
};

// 保存模型配置
const saveModelConfig = async (providerName: string) => {
  saveStatus[providerName] = 'saving';
  try {
    if (!currentSettings.value) {
      currentSettings.value = {
        language: 'zh-CN',
        fontSize: 14,
        modelApiConfigs: [],
      };
    }

    // 创建新的配置数组，避免 Vue 响应式代理
    const existingConfigs = currentSettings.value.modelApiConfigs || [];
    const newConfigs = existingConfigs
      .filter((c) => c.providerName !== providerName)
      .map((c) => ({
        providerName: c.providerName,
        apiKey: c.apiKey,
        baseURL: c.baseURL,
      }));

    // 添加或更新当前配置
    const currentConfig = modelConfigs[providerName];
    newConfigs.push({
      providerName: currentConfig.providerName,
      apiKey: currentConfig.apiKey,
      baseURL: currentConfig.baseURL,
    });

    // 创建纯 JavaScript 对象，确保可序列化
    const updated: Omit<AppSettings, 'id'> = {
      language: currentSettings.value.language || 'zh-CN',
      fontSize: currentSettings.value.fontSize || 14,
      modelApiConfigs: newConfigs,
    };

    await window.electronAPI.writeSettings(updated);
    currentSettings.value = updated;
    saveStatus[providerName] = 'saved';
    setTimeout(() => {
      saveStatus[providerName] = 'idle';
    }, 2000);
  } catch (error) {
    console.error('保存模型配置失败:', error);
    saveStatus[providerName] = 'idle';
  }
};
</script>
