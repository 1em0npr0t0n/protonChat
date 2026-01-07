import { ChatMessageProps, ChatCompletionChunk } from '../types';
interface AsyncIterableStream {
  [Symbol.asyncIterator](): AsyncIterator<string>;
}
export abstract class BaseProvider {
  abstract chat(
    message: ChatMessageProps[],
    modelName: string,
    thinking?: boolean
  ): Promise<AsyncIterable<ChatCompletionChunk>>;
  protected abstract transformResponse(chunk: any): ChatCompletionChunk;
}
