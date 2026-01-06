import { ChatMessageProps, CreateChatProps, ChatMessageImageContent } from './types';
import fs from 'fs/promises';
import { lookup } from 'mime-types';
export async function convertMessages(messages: ChatMessageProps[]): Promise<ChatMessageProps[]> {
  const convertedMessages: ChatMessageProps[] = [];
  for (const message of messages) {
    let convertedContent: ChatMessageImageContent[] | string;
    const { imagePath, ...messageWithoutImagePath } = message;
    if (imagePath) {
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = lookup(imagePath) || 'image/png';
      const base64ImageWithMimeType = `data:${mimeType};base64,${base64Image}`;
      convertedContent = [
        {
          type: 'image_url',
          image_url: {
            url: base64ImageWithMimeType,
          },
        },
        {
          type: 'text',
          text:
            typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
        },
      ];
    } else {
      convertedContent = message.content;
    }
    convertedMessages.push({
      ...messageWithoutImagePath,
      content: convertedContent,
    });
  }
  return convertedMessages;
}
