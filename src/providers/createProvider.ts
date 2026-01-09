import { BaseProvider } from './BaseProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { ErnieProvider } from './ErnieProvider';
import { DpProvider } from './DpProvider';
import 'dotenv/config';
export function createProvider(providerName: string): BaseProvider {
  switch (providerName) {
    case 'qwen':
      return new OpenAIProvider(
        process.env.ALI_API_KEY as string,
        process.env.ALI_API_URL as string
      );
    case 'ernie':
      return new ErnieProvider(
        process.env.BAIDU_API_KEY as string,
        process.env.BAIDU_API_URL as string
      );
    case 'deepseek':
      return new DpProvider(
        process.env.DEEPSEEK_API_KEY as string,
        process.env.DEEPSEEK_API_URL as string
      );
    default:
      throw new Error(`Provider ${providerName} not found`);
  }
}
