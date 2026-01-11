<template>
  <div class="w-[80%] h-[85%] mx-auto grid grid-cols-1 grid-rows-5 gap-4">
    <ProviderSelect v-model="currentConversation" class="row-start-3" :providers="providers" />
  </div>
  <div class="w-[80%] h-[15%] mx-auto flex justify-center items-center">
    <MassageInput
      class="w-full"
      :disabled="currentConversation === ''"
      @create="createConversation"
    />
  </div>
</template>
<script setup lang="ts">
import ProviderSelect from '../components/ProviderSelect.vue';
import { computed, onMounted, ref } from 'vue';
import MassageInput from '../components/MassageInput.vue';
import { useRouter } from 'vue-router';
import { useConversationStore } from '../stores/conversationStore';
import { useMessageStore } from '../stores/messageStore';
const router = useRouter();
//const providers = ref<ProviderProps[]>([]);
import { useProviderStore } from '../stores/providerStore';
const providerStore = useProviderStore();
const providers = computed(() => providerStore.providers);
//const message = ref('');
const currentConversation = ref('');
const messagesStore = useMessageStore();

const conversationStore = useConversationStore();
// function onClick() {
//   console.log(message.value);
// }
onMounted(async () => {
  //providers.value = await db.providers.toArray();
  await providerStore.fetchProviders();
});
const providerInfo = computed(() => {
  const [id, model] = currentConversation.value.split('|');
  return {
    providerId: parseInt(id),
    providerModel: model,
  };
});
const createConversation = async (question: string, imagePath?: string, filePath?: string) => {
  const { providerId, providerModel } = providerInfo.value;
  const currentDate = new Date().toISOString();
  const conversationId = await conversationStore.createConversation({
    providerId,
    selectedModel: providerModel,
    title: question,
    createdAt: currentDate,
    updatedAt: currentDate,
  });
  console.log('conversation imagePath', imagePath);
  console.log('conversation filePath', filePath);
  // const newMessageId = await db.messages.add({
  //   conversationId: parseInt(conversationId),
  //   type: 'question',
  //   content: question,
  //   createdAt: currentDate,
  //   updatedAt: currentDate,
  // });
  const newMessageId = await messagesStore.createMessage({
    conversationId: conversationId,
    type: 'question',
    content: question,
    createdAt: currentDate,
    updatedAt: currentDate,
    ...(imagePath ? { imagePath: imagePath } : {}),
    ...(filePath ? { filePath: filePath } : {}),
  });
  router.push(`/conversation/${conversationId}?init=${newMessageId}`);
  //${value.id}|${model}
};
</script>
