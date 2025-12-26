<template>
  <div class="providerSelect">
    <SelectRoot v-model="currentModel">
      <SelectTrigger
        class="flex w-full justify-between border items-center py-2 px-3
          rounded-md shadow-md data-[placeholder]:text-gray-400"
      >
        <SelectValue placeholder="请选择模型" />
        <Icon icon="radix-icons:chevron-down" class="w-4 h-4"></Icon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent class="bg-white rounded-md shadow-md z-[100] border">
          <SelectViewport>
            <div v-for="value in providers">
              <SelectLabel
                class="flex items-center text-sm leading-6 text-gray-500 px-6"
                value="value.id"
              >
                <img :src="value.avatar" alt="" class="w-4 h-4 rounded-full" />
                {{ value.name }}</SelectLabel
              >
              <SelectGroup>
                <SelectItem
                  v-for="(model, index) in value.models"
                  :key="index"
                  :value="`${value.id}|${model}`"
                  class="flex ontline-none items-center h-7 px-6 rounded
                    text-green-700 cursor-pointer relative
                    data-[highlighted]:bg-green-600
                    data-[highlighted]:text-white"
                >
                  <SelectItemIndicator class="absolute left-2">
                    <Icon
                      icon="radix-icons:check"
                      width="15"
                      height="15"
                    ></Icon>
                  </SelectItemIndicator>
                  <SelectItemText>{{ model }}</SelectItemText>
                </SelectItem>
              </SelectGroup>
              <SelectSeparator class="h-[1px] bg-gray-300 my-2" />
            </div>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue';
import { ProviderProps } from '../types';
defineProps<{
  providers: ProviderProps[];
}>();
const currentModel = defineModel<string>();
</script>
