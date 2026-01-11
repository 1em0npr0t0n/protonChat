import { ChatMessageProps, ChatCompletionChunk } from '../types';
import { BaseProvider } from './BaseProvider';
import { convertMessages } from '../helper';
import OpenAI from 'openai';
import fs from 'fs';
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
    console.log('sendMessages:', JSON.stringify(sendMessages));
    let converMessages = await convertMessages(sendMessages);
    console.log('converMessages:', JSON.stringify(converMessages));

    // 处理文件上传：检查是否有包含 filePath 的消息
    const processedMessages: ChatMessageProps[] = [];

    for (const message of converMessages) {
      if (message.filePath && message.role === 'user') {
        // 上传文件并获取 fileId
        try {
          const fileObj = await this.openai.files.create({
            file: fs.createReadStream(message.filePath),
            purpose: 'file-extract' as OpenAI.FileCreateParams['purpose'],
          });

          // 根据 qwen 的文件对话格式，添加 system 消息
          processedMessages.push({
            role: 'system',
            content: 'You are a helpful assistant.',
          });
          processedMessages.push({
            role: 'system',
            content: `fileid://${fileObj.id}`,
          });

          // 添加用户消息
          processedMessages.push({
            role: 'user',
            content:
              typeof message.content === 'string'
                ? message.content
                : Array.isArray(message.content)
                  ? message.content.find((item) => item.type === 'text')?.text || ''
                  : '',
          });
        } catch (error) {
          console.error('文件上传失败:', error);
          // 如果文件上传失败，仍然发送原始消息
          processedMessages.push(message);
        }
      } else {
        processedMessages.push(message);
      }
    }
    console.log('processedMessages:', JSON.stringify(processedMessages));
    converMessages = processedMessages;

    const params: OpenAI.ChatCompletionCreateParamsStreaming = {
      model: selectedModel,
      messages: converMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      stream: true,
    };

    // 如果 enable_thinking 是自定义参数
    if (thinking) {
      (
        params as OpenAI.ChatCompletionCreateParamsStreaming & { enable_thinking: boolean }
      ).enable_thinking = thinking;
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
