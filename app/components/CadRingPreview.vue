<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    class="rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900"
    role="img"
    :aria-label="`Shape outline, ${ring.vertices.length} corners`"
  >
    <polygon
      :points="points"
      class="fill-blue-500/15 stroke-blue-600 dark:stroke-blue-400"
      stroke-width="1.25"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CadRing } from "~/utils/cadImport";
import { ringToSvgPoints } from "~/utils/cadImport";

// A thumbnail of the shape itself is the fastest way for a surveyor to tell
// their parcel from a building footprint or a road reserve in the same
// drawing — far quicker than comparing areas and vertex counts.
const props = withDefaults(
  defineProps<{ ring: CadRing; size?: number }>(),
  { size: 44 }
);

const points = computed(() => ringToSvgPoints(props.ring, props.size));
</script>
