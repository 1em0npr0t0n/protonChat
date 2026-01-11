import zhCN from '../i18n/locales/zh-CN';
import enUS from '../i18n/locales/en-US';
import { readSettings } from '../config';

export type SupportedLocale = 'zh-CN' | 'en-US';

type MenuTranslations = {
  action: string;
  newChat: string;
  appSettings: string;
  exit: string;
  about: string;
  services: string;
  hide: string;
  hideOthers: string;
  showAll: string;
};

const translations: Record<SupportedLocale, MenuTranslations> = {
  'zh-CN': {
    action: zhCN.menu.action,
    newChat: zhCN.menu.newChat,
    appSettings: zhCN.menu.appSettings,
    exit: zhCN.menu.exit,
    about: zhCN.menu.about,
    services: zhCN.menu.services,
    hide: zhCN.menu.hide,
    hideOthers: zhCN.menu.hideOthers,
    showAll: zhCN.menu.showAll,
  },
  'en-US': {
    action: enUS.menu.action,
    newChat: enUS.menu.newChat,
    appSettings: enUS.menu.appSettings,
    exit: enUS.menu.exit,
    about: enUS.menu.about,
    services: enUS.menu.services,
    hide: enUS.menu.hide,
    hideOthers: enUS.menu.hideOthers,
    showAll: enUS.menu.showAll,
  },
};

/**
 * 获取菜单翻译
 * @returns 当前语言对应的菜单翻译
 */
export async function getMenuTranslations(): Promise<MenuTranslations> {
  try {
    const settings = await readSettings();
    const locale = (settings?.language || 'zh-CN') as SupportedLocale;
    return translations[locale] || translations['zh-CN'];
  } catch (error) {
    console.error('获取菜单翻译失败:', error);
    return translations['zh-CN'];
  }
}
