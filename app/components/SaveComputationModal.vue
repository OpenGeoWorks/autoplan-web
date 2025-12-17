<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/50" @click="cancel"></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-4 z-10"
    >
      <div
        class="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Save Computation
        </h3>
        <button
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          @click="cancel"
        >
          ✕
        </button>
      </div>

      <div class="p-4 space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Computation Name
          </label>
          <input
            v-model="computationName"
            type="text"
            placeholder="Enter computation name"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="save"
          />
        </div>

        <div
          v-if="error"
          class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300"
        >
          {{ error }}
        </div>
      </div>

      <div
        class="p-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3"
      >
        <button
          @click="cancel"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          @click="save"
          :disabled="!computationName.trim() || isSaving"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span
            v-if="isSaving"
            class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          {{ isSaving ? "Saving..." : "Save" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", name: string): void;
}>();

const isOpen = ref(props.modelValue);
const computationName = ref("");
const error = ref("");
const isSaving = ref(false);

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      // Reset when opening
      computationName.value = "";
      error.value = "";
      isSaving.value = false;
    }
  }
);

watch(isOpen, (newVal) => {
  emit("update:modelValue", newVal);
});

const cancel = () => {
  isOpen.value = false;
};

const save = () => {
  if (!computationName.value.trim()) {
    error.value = "Please enter a computation name";
    return;
  }

  error.value = "";
  emit("save", computationName.value.trim());
};

defineExpose({
  setLoading: (loading: boolean) => {
    isSaving.value = loading;
  },
  setError: (err: string) => {
    error.value = err;
  },
  close: () => {
    isOpen.value = false;
  },
});
</script>
