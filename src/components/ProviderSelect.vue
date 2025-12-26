<template>
  <div class="providerSelect">
    <SelectRoot>
      <SelectTrigger>
        <SelectValue placeholder="请选择模型" />
        <SelectIcon />
      </SelectTrigger>

      <SelectPortal>
        <SelectContent>
          <SelectViewport>
            <SelectItem value="GPT-3.5-turbo">
              <SelectItemText>GPT-3.5-turbo</SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
            <SelectItem value="doubao">
              <SelectItemText>doubao</SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
            <SelectSeparator />
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
<script setup lang="ts">
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
} from 'radix-vue'
</script>
