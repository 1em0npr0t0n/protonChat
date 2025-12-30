<template>
  <div class="w-[80%] h-[85%] mx-auto grid grid-cols-1 grid-rows-5 gap-4">
    {{ message }}
    <ProviderSelect class="row-start-3" :providers="providers" v-model="selectedModel" />
  </div>
  <div class="w-[80%] h-[15%] mx-auto flex justify-center items-center">
    <MassageInput class="w-full" v-model="message" @onClick="onClick" />
  </div>
</template>
<script setup lang="ts">
import ProviderSelect from '../components/ProviderSelect.vue';
import { ref } from 'vue';
import MassageInput from '../components/MassageInput.vue';
import { providers } from '../testData';
const message = ref('');
const selectedModel = ref('');
function onClick() {
  console.log(message.value);
}
</script>
