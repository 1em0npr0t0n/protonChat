import { defineStore } from 'pinia';
import { AppSettings } from '../types';
import { setLocale, SupportedLocale } from '../i18n';

export interface SettingsStore {
  settings: Omit<AppSettings, 'id'> | null;
}

const DEFAULT_SETTINGS: Omit<AppSettings, 'id'> = {
  language: 'zh-CN',
  fontSize: 14,
};

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStore => {
    return {
      settings: null,
    };
  },
  actions: {
    // 初始化设置（从文件读取，如果不存在则使用默认设置）
    async initSettings() {
      try {
        const settings = await window.electronAPI.readSettings();
        this.settings = settings;
        // 初始化时同步 i18n 语言
        if (
          settings?.language &&
          (settings.language === 'zh-CN' || settings.language === 'en-US')
        ) {
          setLocale(settings.language as SupportedLocale);
        }
      } catch (error) {
        console.error('读取配置失败:', error);
        this.settings = DEFAULT_SETTINGS;
        // 保存默认配置
        await window.electronAPI.writeSettings(DEFAULT_SETTINGS);
        // 初始化默认语言
        setLocale('zh-CN');
      }
    },
    // 获取设置
    async fetchSettings() {
      try {
        const settings = await window.electronAPI.readSettings();
        this.settings = settings;
        // 同步 i18n 语言
        if (
          settings?.language &&
          (settings.language === 'zh-CN' || settings.language === 'en-US')
        ) {
          setLocale(settings.language as SupportedLocale);
        }
      } catch (error) {
        console.error('读取配置失败:', error);
        if (!this.settings) {
          this.settings = DEFAULT_SETTINGS;
        }
      }
    },
    // 更新设置
    async updateSettings(updates: Partial<Omit<AppSettings, 'id'>>) {
      if (!this.settings) {
        await this.initSettings();
      }
      if (this.settings) {
        const updated = { ...this.settings, ...updates };
        try {
          await window.electronAPI.writeSettings(updated);
          this.settings = updated;
          // 如果更新了语言，同步到 i18n
          if (updates.language && (updates.language === 'zh-CN' || updates.language === 'en-US')) {
            setLocale(updates.language as SupportedLocale);
          }
        } catch (error) {
          console.error('保存配置失败:', error);
        }
      }
    },
    // 更新语言
    async setLanguage(language: string) {
      await this.updateSettings({ language });
    },
    // 更新字体大小
    async setFontSize(fontSize: number) {
      await this.updateSettings({ fontSize });
    },
  },
  getters: {
    currentLanguage: (state) => state.settings?.language || 'zh-CN',
    currentFontSize: (state) => state.settings?.fontSize || 14,
  },
});
