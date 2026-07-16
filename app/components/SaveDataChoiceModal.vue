<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
        {{ message }}
      </p>

      <div class="mt-5 space-y-3">
        <button
          :disabled="submitting"
          @click="$emit('add')"
          class="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div class="font-medium text-gray-900 dark:text-gray-100">
            Add to existing
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            Merge with the current data. Matching stations are replaced with the
            new values; new stations are appended.
          </div>
        </button>

        <button
          :disabled="submitting"
          @click="$emit('replace')"
          class="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-red-500 hover:bg-red-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div class="font-medium text-gray-900 dark:text-gray-100">
            Replace existing
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            Discard the current data and use only the computed values.
          </div>
        </button>
      </div>

      <div class="flex justify-end mt-5">
        <button
          :disabled="submitting"
          @click="$emit('close')"
          class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>

      <div
        v-if="submitting"
        class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-800/60 rounded-lg"
      >
        <span
          class="inline-block w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    show: boolean;
    title?: string;
    message?: string;
    submitting?: boolean;
  }>(),
  {
    title: "Save computed data",
    message:
      "Do you want to replace the existing data, or add the computed data to it?",
    submitting: false,
  }
);

defineEmits<{ replace: []; add: []; close: [] }>();
</script>
