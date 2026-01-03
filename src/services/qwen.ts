import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import { ChatMessageProps } from '../types';
export class QwenOpenAI {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      baseURL: process.env.ALI_API_URL,
      apiKey: process.env.ALI_API_KEY,
    });
  }
  async chatImageDescription(props: ChatMessageProps, imageBuffer: Buffer) {
    //     const imageBuffer = await fs.readFile('src/public/dog.jpg');
    //   const base64Image = Buffer.from(imageBuffer).toString('base64');
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    //const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    const stream = await this.openai.chat.completions.create({
      model: 'qwen3-vl-plus',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
            { type: 'text', text: props.content },
          ],
        },
      ],
      stream: true,
    });

    return stream;
  }

  async chatFile(fileDir: string) {
    // 'src/public/htyc.docx'
    const fileObj = await this.openai.files.create({
      file: fs.createReadStream(fileDir),
      purpose: 'file-extract' as any,
    });
    //console.log(JSON.stringify(fileObj));
    const stream = await this.chatMessageFile(fileObj.id);

    return stream;
  }
  async chatMessageFile(fileId: string) {
    const stream = await this.openai.chat.completions.create({
      model: 'qwen-long',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        // 请将 '{FILE_ID}'替换为您实际对话场景所使用的 fileid
        {
          role: 'system',
          content: `fileid://${fileId}`,
        },
        {
          role: 'user',
          content: '这篇文章讲了什么?',
        },
      ],
    });
    return stream;
  }

  //let isAnswering = false;
  async chatMessage(sendMessages: ChatMessageProps[], selectedModel: string) {
    try {
      const stream = await this.openai.chat.completions.create({
        model: selectedModel,
        messages: sendMessages,
        stream: true,
        enable_thinking: true,
      } as any);
      console.log('\n' + '='.repeat(20) + '思考过程' + '='.repeat(20));
      return stream;
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
/*
// export const openai = new OpenAI({
//   baseURL: process.env.ALI_API_URL,
//   apiKey: process.env.ALI_API_KEY,
// });

export async function chatImageDescription(props: ChatMessageProps, imageBuffer: Buffer) {
  //     const imageBuffer = await fs.readFile('src/public/dog.jpg');
  //   const base64Image = Buffer.from(imageBuffer).toString('base64');
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  //const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
  const stream = await openai.chat.completions.create({
    model: 'qwen3-vl-plus',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          { type: 'text', text: props.content },
        ],
      },
    ],
    stream: true,
  });
  //   let description = '';
  //   for await (const chunk of stream) {
  //     if (!chunk.choices?.length) {
  //       console.log('\nUsage:');
  //       console.log(chunk.usage);
  //       continue;
  //     }
  //     const delta = chunk.choices[0].delta;
  //     if (delta.content) {
  //       description += delta.content;
  //     }
  //   }
  return stream;
}

// console.log(response.choices[0].message.content);
// console.log(JSON.stringify(response));
// for await (const part of response) {
//   const delta = part.choices[0].delta.content;

//   console.log(JSON.stringify(part));
// }

export async function chatFile(fileDir: string) {
  // 'src/public/htyc.docx'
  const fileObj = await openai.files.create({
    file: fs.createReadStream(fileDir),
    purpose: 'file-extract' as any,
  });
  //console.log(JSON.stringify(fileObj));
  const stream = await chatMessageFile(fileObj.id);

  return stream;
}
export async function chatMessageFile(fileId: string) {
  const stream = await openai.chat.completions.create({
    model: 'qwen-long',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      // 请将 '{FILE_ID}'替换为您实际对话场景所使用的 fileid
      {
        role: 'system',
        content: `fileid://${fileId}`,
      },
      {
        role: 'user',
        content: '这篇文章讲了什么?',
      },
    ],
    // 所有代码示例均采用流式输出，以清晰和直观地展示模型输出过程。如果您希望查看非流式输出的案例，请参见https://help.aliyun.com/zh/model-studio/text-generation
    // stream: true,
    // stream_options: {
    //   include_usage: true,
    // },
  });
  return stream;
  //   # 初始化messages列表
  // completion = client.chat.completions.create(
  //     model="qwen-long",
  //     messages=[
  //         {'role': 'system', 'content': 'You are a helpful assistant.'},
  //         # 请将 '{FILE_ID}'替换为您实际对话场景所使用的 fileid
  //         {'role': 'system', 'content': f'fileid://{FILE_ID}'},
  //         {'role': 'user', 'content': '这篇文章讲了什么?'}
  //     ],
  //     # 所有代码示例均采用流式输出，以清晰和直观地展示模型输出过程。如果您希望查看非流式输出的案例，请参见https://help.aliyun.com/zh/model-studio/text-generation
  //     stream=True,
  //     stream_options={"include_usage": True}
}

//let isAnswering = false;
export async function chatMessage(sendMessages: ChatMessageProps[], selectedModel: string) {
  try {
    const stream = await openai.chat.completions.create({
      model: selectedModel,
      messages: sendMessages,
      stream: true,
      enable_thinking: true,
    } as any);
    console.log('\n' + '='.repeat(20) + '思考过程' + '='.repeat(20));
    return stream;
    // for await (const chunk of stream) {
    //   const delta = chunk.choices[0].delta;
    //   if (delta.reasoning_content !== undefined && delta.reasoning_content !== null) {
    //     if (!isAnswering) {
    //       process.stdout.write(delta.reasoning_content);
    //     }
    //   }
    //   if (delta.content !== undefined && delta.content) {
    //     if (!isAnswering) {
    //       console.log('\n' + '='.repeat(20) + '完整回复' + '='.repeat(20));
    //       isAnswering = true;
    //     }
    //     process.stdout.write(delta.content);
    //   }
    // }
  } catch (error) {
    console.error('Error:', error);
  }
}
*/
