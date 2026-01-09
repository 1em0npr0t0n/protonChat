import OpenAI from 'openai';
import { ChatCompletionChunk, ChatMessageProps } from '../types';
import { BaseProvider } from './BaseProvider';

export class DpProvider extends BaseProvider {
  private openai: OpenAI;
  constructor(apiKey: string, baseURL: string) {
    super();
    this.openai = new OpenAI({
      apiKey,
      baseURL,
    });
  }
  async chat(messages: ChatMessageProps[], modelName: string) {
    const params: OpenAI.ChatCompletionCreateParamsStreaming = {
      model: modelName,
      messages: messages as any,
      stream: true,
    };

    const stream = await this.openai.chat.completions.create(params);
    console.log('\n' + '='.repeat(20) + 'deepseek思考过程' + '='.repeat(20));
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
