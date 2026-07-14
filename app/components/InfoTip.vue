<template>
  <UTooltip :text="text" :content="{ side: 'top' }" :delay-duration="100">
    <button
      type="button"
      tabindex="-1"
      aria-label="More information"
      class="inline-flex items-center justify-center align-middle text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 cursor-help"
    >
      <RiInformationLine class="w-3.5 h-3.5" />
    </button>
  </UTooltip>
</template>

<script setup lang="ts">
import { RiInformationLine } from "@remixicon/vue";

defineProps<{ text: string }>();
</script>
