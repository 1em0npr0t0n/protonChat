import { app } from 'electron';
import path from 'node:path';
import fs from 'fs/promises';
import { ModelApiConfig, AppSettings } from './types';

// 获取设置文件路径
const getSettingsPath = () => {
  const UserDataPath = app.getPath('userData');
  return path.join(UserDataPath, 'settings.json');
};

// 默认设置
const DEFAULT_SETTINGS: Omit<AppSettings, 'id'> = {
  language: 'zh-CN',
  fontSize: 14,
  modelApiConfigs: [],
};

// 读取设置文件
export async function readSettings(): Promise<Omit<AppSettings, 'id'>> {
  const settingsPath = getSettingsPath();
  try {
    const data = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(data);
    // 确保向后兼容，如果没有 modelApiConfigs 字段，则初始化为空数组
    if (!settings.modelApiConfigs) {
      settings.modelApiConfigs = [];
    }
    return settings;
  } catch (error) {
    // 文件不存在，返回默认配置
    return { ...DEFAULT_SETTINGS };
  }
}

// 写入设置文件
export async function writeSettings(settings: Omit<AppSettings, 'id'>): Promise<void> {
  const settingsPath = getSettingsPath();
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
}

// 获取提供者配置对象
export async function getProvidersConfigs(): Promise<Record<string, ModelApiConfig>> {
  const settings = await readSettings();
  const configs: Record<string, ModelApiConfig> = {
    qwen: {
      providerName: 'qwen',
      apiKey: '',
      baseURL: '',
    },
    ernie: {
      providerName: 'ernie',
      apiKey: '',
      baseURL: '',
    },
    deepseek: {
      providerName: 'deepseek',
      apiKey: '',
      baseURL: '',
    },
  };

  // 从设置中加载已保存的配置
  if (settings.modelApiConfigs) {
    settings.modelApiConfigs.forEach((config) => {
      if (configs[config.providerName]) {
        configs[config.providerName] = { ...config };
      }
    });
  }

  return configs;
}

// 导出提供者配置（供 createProvider 使用）
export let providersConfigs: Record<string, ModelApiConfig> = {
  qwen: {
    providerName: 'qwen',
    apiKey: '',
    baseURL: '',
  },
  ernie: {
    providerName: 'ernie',
    apiKey: '',
    baseURL: '',
  },
  deepseek: {
    providerName: 'deepseek',
    apiKey: '',
    baseURL: '',
  },
};

// 初始化配置（在应用启动时调用）
export async function initConfig(): Promise<void> {
  providersConfigs = await getProvidersConfigs();
}

// 刷新配置（在设置更新后调用）
export async function refreshConfig(): Promise<void> {
  providersConfigs = await getProvidersConfigs();
}
