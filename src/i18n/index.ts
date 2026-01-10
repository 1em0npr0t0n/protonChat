import { createI18n } from 'vue-i18n';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

export type SupportedLocale = 'zh-CN' | 'en-US';

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

// 获取默认语言（初始值，后续会从 Electron settings 中读取并更新）
const getDefaultLocale = (): SupportedLocale => {
  // 根据浏览器语言自动选择默认值
  // 实际语言会在应用启动时从 Electron settings.json 读取并更新
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en-US';
};

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages,
});

// 导出设置语言的函数
// 语言设置会通过 IPC 调用保存到 Electron settings.json 中
export const setLocale = (locale: SupportedLocale) => {
  i18n.global.locale.value = locale;
};

// 导出获取当前语言的函数
export const getLocale = (): SupportedLocale => {
  return i18n.global.locale.value as SupportedLocale;
};
