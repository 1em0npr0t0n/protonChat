<template>
  <div class="w-[80%] h-[85%] mx-auto grid grid-cols-1 grid-rows-5 gap-4">
    <ProviderSelect v-model="currentConversation" class="row-start-3" :providers="providers" />
  </div>
  <div class="w-[80%] h-[15%] mx-auto flex justify-center items-center">
    <MassageInput class="w-full" @create="createConversation" />
  </div>
</template>
<script setup lang="ts">
import ProviderSelect from '../components/ProviderSelect.vue';
import { computed, onMounted, ref } from 'vue';
import MassageInput from '../components/MassageInput.vue';
import { ProviderProps } from '../types';
import { db } from '../db/db';
import { useRouter } from 'vue-router';
const router = useRouter();
const providers = ref<ProviderProps[]>([]);
//const message = ref('');
const currentConversation = ref('');
// function onClick() {
//   console.log(message.value);
// }
onMounted(async () => {
  providers.value = await db.providers.toArray();
});
const providerInfo = computed(() => {
  const [id, model] = currentConversation.value.split('|');
  return {
    providerId: parseInt(id),
    providerModel: model,
  };
});
const createConversation = async (question: string) => {
  const { providerId, providerModel } = providerInfo.value;
  const currentData = new Date().toISOString();
  const conversationId = await db.conversations.add({
    providerId,
    selectedModel: providerModel,
    title: question,
    createdAt: currentData,
    updatedAt: currentData,
  });
  const newMessageId = await db.messages.add({
    conversationId: parseInt(conversationId),
    type: 'question',
    content: question,
    createdAt: currentData,
    updatedAt: currentData,
  });
  router.push(`/conversation/${conversationId}?init=${newMessageId}`);
  //${value.id}|${model}
};
</script>
