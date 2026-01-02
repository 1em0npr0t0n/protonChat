import OpenAI from 'openai';
import { ChatMessageProps } from '../types';
import 'dotenv/config';
export class BaiduOpenAI {
  private openai: OpenAI;

  constructor() {
    // 构造函数
    this.openai = new OpenAI({
      baseURL: process.env.BAIDU_API_URL,
      apiKey: process.env.BAIDU_API_KEY,
    });
    console.log(
      `百度文心一言API初始化完成, baseURL: ${process.env.BAIDU_API_URL}|apiKey: ${process.env.BAIDU_API_KEY}`
    );
  }
  async chatMessage(sendMessages: ChatMessageProps[], selectedModel: string) {
    try {
      //console.log(JSON.stringify(sendMessages));
      const stream = await this.openai.chat.completions.create({
        model: selectedModel,
        messages: sendMessages,
        stream: true,
        temperature: 0.95,
        top_p: 0.7,
        //"penalty_score": 1
      });
      return stream;
    } catch (error) {
      console.error('百度文心一言API调用失败:', error);
      throw new Error(`API调用错误: ${error.message}`);
    }
  }
}
