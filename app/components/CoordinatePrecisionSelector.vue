<template>
  <label class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
    <span class="hidden sm:inline">Precision</span>
    <select
      :value="modelValue"
      class="text-xs px-2 py-1 border rounded bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200"
      title="Display precision (does not affect stored values or CSV export)"
      @change="onChange"
    >
      <option
        v-for="option in COORDINATE_PRECISION_OPTIONS"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import {
  COORDINATE_PRECISION_OPTIONS,
  type CoordinatePrecision,
} from "~/utils/formatCoordinate";

defineProps<{ modelValue: CoordinatePrecision }>();

const emit = defineEmits<{
  "update:modelValue": [value: CoordinatePrecision];
}>();

function onChange(event: Event) {
  emit(
    "update:modelValue",
    (event.target as HTMLSelectElement).value as CoordinatePrecision,
  );
}
</script>
