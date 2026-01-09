import { ChatMessageProps, ChatCompletionChunk } from '../types';
import { BaseProvider } from './BaseProvider';
import { convertMessages } from '../helper';
import OpenAI from 'openai';
export class OpenAIProvider extends BaseProvider {
  private openai: OpenAI;
  constructor(apiKey: string, baseURL: string) {
    super();
    this.openai = new OpenAI({
      apiKey,
      baseURL,
    });
  }
  async chat(sendMessages: ChatMessageProps[], selectedModel: string, thinking: boolean) {
    const converMessages = await convertMessages(sendMessages);
    const params: OpenAI.ChatCompletionCreateParamsStreaming = {
      model: selectedModel,
      messages: converMessages as any,
      stream: true,
    };

    // 如果 enable_thinking 是自定义参数
    if (thinking) {
      (params as any).enable_thinking = thinking;
    }

    const stream = await this.openai.chat.completions.create(params);
    console.log('\n' + '='.repeat(20) + 'qwen思考过程' + '='.repeat(20));
    const self = this;
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          // const delta = part.choices[0].delta.content || '';
          yield self.transformResponse(chunk);
        }
      },
    };
  }
  protected transformResponse(chunk: OpenAI.ChatCompletionChunk): ChatCompletionChunk {
    const delta = chunk.choices[0].delta.content || '';
    const isFinished = chunk.choices[0].finish_reason === 'stop';
    return {
      delta,
      //isFinished: chunk.choices[0].finish_reason !== null,
      isFinished,
    };
  }
}
