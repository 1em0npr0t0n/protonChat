<template>
  <div
    v-if="conversation"
    class="h-[10%] border-b bg-gray-200 border-gray-300 flex items-center justify-between px-[2%]"
  >
    <h3 class="text-sm font-bold underline inline-block">{{ conversation.title }}</h3>
    <span class="text-sm text-gray-500">{{ conversation.selectedModel }}</span>
  </div>
  <div ref="messageListContainerRef" class="w-[80%] h-[75%] mt-[5px] mx-auto overflow-y-auto">
    <MessageList ref="messageListRef" :messages="filteredMessages" />
  </div>
  <div class="w-[80%] h-[15%] flex justify-between items-center mx-auto">
    <MassageInput
      v-model="inputValue"
      class="w-full"
      :disabled="messageStore.isMessageLoading()"
      @create="sendNewMessage"
    />
  </div>
</template>
<script lang="ts" setup>
import { MessageProps, ChatMessageProps, MessageListInstance } from '../types';
import MessageList from '../components/MessageList.vue';
import MassageInput from '../components/MassageInput.vue';
import { ref, watch, onMounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
//import { messages } from '../testData';
import { useProviderStore } from '../stores/providerStore';
import { useConversationStore } from '../stores/conversationStore';
import { useMessageStore } from '../stores/messageStore';
const messageStore = useMessageStore();
const conversationStore = useConversationStore();
const providerStore = useProviderStore();
const filteredMessages = computed(() => messageStore.messages);
const sendMessages = computed(() =>
  filteredMessages.value
    .filter((item) => item.statue !== 'loading')
    .map((message): ChatMessageProps => {
      return {
        role: message.type === 'question' ? 'user' : 'assistant',
        content: message.content,
        ...(message.imagePath ? { imagePath: message.imagePath } : {}),
      };
    })
);

const inputValue = ref('');
const messageListRef = ref<MessageListInstance>();
const route = useRoute();
let conversationId = ref(Number(route.params.id as string));
//let lastQuestion = computed(() => messageStore.getLastQuestion(conversationId.value));
const initMessageId = Number(route.query.init as string);
const conversation = computed(() => conversationStore.getConversationById(conversationId.value));
const sendNewMessage = async (question: string, imagePath?: string) => {
  console.log('wai sendNewMessage uestion', question);
  if (question) {
    const currentDate = new Date().toISOString();
    console.log('nei sendNewMessage uestion', question);
    const _newMessageId = await messageStore.createMessage({
      conversationId: conversationId.value,
      type: 'question',
      content: question,
      createdAt: currentDate,
      updatedAt: currentDate,
      ...(imagePath ? { imagePath: imagePath } : {}),
    });
    console.log('nei _newMessageId', _newMessageId);
    inputValue.value = '';
    await creatingInitMessage();
  }
};
const creatingInitMessage = async () => {
  const createdData: Omit<MessageProps, 'id'> = {
    conversationId: conversationId.value,
    type: 'answer',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statue: 'loading',
  };
  const newMessageId = await messageStore.createMessage(createdData);
  await messageScrollToBottom();
  if (conversation.value) {
    //const provider = await db.providers.where({ id: conversation.value?.providerId }).first();
    const provider = providerStore.getProviderById(conversation.value.providerId);
    if (provider && sendMessages.value.length > 0) {
      console.log('sendMessages', sendMessages, 'filteredMessages.value', filteredMessages.value);
      await window.electronAPI.startChat({
        messageId: newMessageId,
        providerName: provider?.name || '',
        selectedModel: conversation.value?.selectedModel || '',
        //content: lastQuestion.value?.content || '',
        messages: sendMessages.value,
      });
    }
  }
};

//filteredMessages.value = messages.filter((item) => item.conversationId === conversationId.value);
const messageScrollToBottom = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.ref.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }
};
watch(
  () => route.params.id,
  async (newVal: string) => {
    //, oldVal: string
    conversationId.value = Number(newVal);

    await messageStore.fetchMessagesbyConversationId(conversationId.value);
    await messageScrollToBottom();
  }
);
onMounted(async () => {
  let streamContent = '';
  await messageStore.fetchMessagesbyConversationId(conversationId.value);
  await messageScrollToBottom();
  if (initMessageId) {
    await creatingInitMessage();
  }
  let currentMessageListHeight = 0;
  const checkAndScrollToBottom = async () => {
    const newHeight = messageListRef.value?.ref.clientHeight;
    if (newHeight && newHeight > currentMessageListHeight) {
      currentMessageListHeight = newHeight;
      await messageScrollToBottom();
    }
  };
  window.electronAPI.onUpdateMessage(async (streamData) => {
    //console.log(streamData);
    const { messageId, data } = streamData;
    streamContent += data.delta;
    const updateData: Omit<MessageProps, 'id' | 'createdAt' | 'conversationId'> = {
      type: 'answer',
      content: streamContent,
      updatedAt: new Date().toISOString(),
      statue: data.isFinished ? 'finished' : 'streaming',
    };
    await messageStore.updateMessage(messageId, updateData);
    await nextTick();
    await checkAndScrollToBottom();
  });
});
</script>
