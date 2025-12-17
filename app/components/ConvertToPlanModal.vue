<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/50" @click="onClose"></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-4 z-10 p-6"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Convert to Plan
        </h3>
        <button
          @click="onClose"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Select the type of plan you want to create from this computation.
      </p>

      <div class="mb-6">
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
        >
          Plan Type
        </label>
        <select
          v-model="localPlanType"
          class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>Select a plan type</option>
          <option value="cadastral">Cadastral</option>
          <option value="route">Route</option>
          <option value="topographic">Topographic</option>
          <option value="layout">Layout</option>
        </select>
      </div>

      <div class="flex items-center justify-end gap-3">
        <button
          @click="onClose"
          :disabled="loading"
          class="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleConvert"
          :disabled="loading"
          class="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center transition-colors"
        >
          <svg
            v-if="loading"
            class="animate-spin w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ loading ? "Converting..." : "Convert" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "convert", planType: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const localPlanType = ref<string>("");

watch(
  () => localPlanType.value,
  (newValue) => {
    localPlanType.value = newValue;
  }
);

const onClose = () => {
  emit("update:modelValue", false);
};

const handleConvert = () => {
  emit("convert", localPlanType.value);
};
</script>

<style scoped></style>
