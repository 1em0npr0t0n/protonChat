import { BaseProvider } from './BaseProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { ErnieProvider } from './ErnieProvider';
import { DpProvider } from './DpProvider';
import { getProvidersConfigs } from '../config';

export async function createProvider(providerName: string): Promise<BaseProvider> {
  const modelApiConfig = await getProvidersConfigs();
  if (!modelApiConfig[providerName]) {
    throw new Error(`Model API config for ${providerName} not found`);
  }

  if (!modelApiConfig[providerName].apiKey || !modelApiConfig[providerName].baseURL) {
    throw new Error(`Model API config for ${providerName} is incomplete`);
  }
  console.log('modelApiConfig', modelApiConfig);
  switch (providerName) {
    case 'qwen':
      return new OpenAIProvider(
        modelApiConfig[providerName].apiKey,
        modelApiConfig[providerName].baseURL
      );
    case 'ernie':
      return new ErnieProvider(
        modelApiConfig[providerName].apiKey,
        modelApiConfig[providerName].baseURL
      );
    case 'deepseek':
      return new DpProvider(
        modelApiConfig[providerName].apiKey,
        modelApiConfig[providerName].baseURL
      );
    default:
      throw new Error(`Provider ${providerName} not found`);
  }
}
