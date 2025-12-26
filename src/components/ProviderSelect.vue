<template>
  <div class="providerSelect">
    <SelectRoot>
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
              <SelectLabel value="value.id">
                <img :src="value.avatar" alt="" class="w-4 h-4 rounded-full" />
                {{ value.name }}</SelectLabel
              >
              <SelectGroup>
                <SelectItem
                  v-for="(model, index) in value.models"
                  :key="index"
                  :value="model"
                >
                  <SelectItemText>{{ model }}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              </SelectGroup>
            </div>

            <SelectSeparator />
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
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue';
import { ProviderProps } from '../types';
defineProps<{
  providers: ProviderProps[];
}>();
</script>
