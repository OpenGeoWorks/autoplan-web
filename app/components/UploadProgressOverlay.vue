<!--
  Cover the screen while a survey upload runs.

  A large file is parsed and stored inside the request, which takes about a
  minute for a million and a half points. Without something on screen that
  reads as working, a wait that long is indistinguishable from a frozen tab —
  which is exactly what it was mistaken for.
-->
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
  >
    <div
      class="w-[min(26rem,90vw)] rounded-lg bg-white dark:bg-slate-800 p-6 shadow-xl"
    >
      <div class="flex items-center gap-3">
        <svg class="h-5 w-5 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ title }}
        </p>
      </div>

      <p class="mt-3 text-xs text-gray-600 dark:text-gray-400">
        {{ label || "Working…" }}
      </p>

      <!--
        Indeterminate unless there is a real percentage to show. Sending bytes
        is measurable; the server reading them is not, and a bar parked at
        100% reads as stuck.
      -->
      <div
        class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700"
      >
        <div
          class="h-full rounded-full bg-blue-600 transition-all duration-500"
          :class="percent > 0 ? '' : 'w-1/3 animate-pulse'"
          :style="percent > 0 ? { width: percent + '%' } : undefined"
        />
      </div>

      <p class="mt-3 text-[11px] text-gray-500 dark:text-gray-400">
        {{ note }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean;
    /** Current step, e.g. "Uploading the file… 42%". */
    label?: string;
    /** 0 means "no measurable progress"; the bar goes indeterminate. */
    percent?: number;
    title?: string;
    note?: string;
  }>(),
  {
    label: "",
    percent: 0,
    title: "Importing your survey",
    note: "A large survey takes a minute or so to read. Please keep this tab open until it finishes.",
  },
);
</script>
