<template>
  <div>
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Longitudinal Profile Parameters
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Configure the parameters for generating the longitudinal profile drawing
      </p>
    </div>

    <div class="space-y-6">
      <!-- Scales -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
          >
            Horizontal Scale
            <InfoTip text="Drawing units per metre of chainage — stretches or compresses the profile horizontally. 1.0 draws 1 m of road as 1 unit." />
          </label>
          <input
            v-model.number="local.params.horizontal_scale"
            type="number"
            step="0.1"
            min="0.1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="1.0"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Horizontal scale factor (e.g., 1:1000)
          </p>
        </div>

        <div>
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
          >
            Vertical Scale
            <InfoTip text="Drawing units per metre of elevation. Profiles exaggerate height so gentle slopes are visible — 5–10x the horizontal scale is typical." />
          </label>
          <input
            v-model.number="local.params.vertical_scale"
            type="number"
            step="1"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="10"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Vertical exaggeration factor (e.g., 1:100)
          </p>
        </div>
      </div>

      <!-- Profile Origin -->
      <div>
        <label
          class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1"
        >
          Profile Origin (X, Y)
          <InfoTip text="Drawing coordinates where the profile grid starts. Leave at (0, 0) unless composing several profiles on one sheet." />
        </label>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <input
              v-model.number="local.params.profile_origin[0]"
              type="number"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="X (0.0)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">X coordinate</p>
          </div>
          <div>
            <input
              v-model.number="local.params.profile_origin[1]"
              type="number"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Y (0.0)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Y coordinate</p>
          </div>
        </div>
      </div>

      <!-- Intervals -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
          >
            Station Interval (m)
            <InfoTip text="Ground distance between your chainage stations (how often levels were taken along the route), e.g. 20 m." />
          </label>
          <input
            v-model.number="local.params.station_interval"
            type="number"
            step="1"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="10"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Distance between station marks
          </p>
        </div>

        <div>
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
          >
            Elevation Interval (m)
            <InfoTip text="Vertical spacing of the horizontal grid lines and elevation labels on the profile." />
          </label>
          <input
            v-model.number="local.params.elevation_interval"
            type="number"
            step="0.1"
            min="0.1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="1"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Vertical grid line spacing
          </p>
        </div>
      </div>

      <!-- Starting Chainage -->
      <div>
        <label
          class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
        >
          Starting Chainage (m)
          <InfoTip text="Chainage of your first station — usually 0 unless this profile continues from a previous section." />
        </label>
        <input
          v-model.number="local.params.starting_chainage"
          type="number"
          step="1"
          min="0"
          class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="0.0"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Initial chainage value for the profile
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 mt-8">
      <button
        @click="saveAndContinue"
        :disabled="loading || !isValid"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Saving..." : "Save & Continue" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import InfoTip from "~/components/InfoTip.vue";
import { useRoute } from "vue-router";

interface LongitudinalParams {
  horizontal_scale: number;
  vertical_scale: number;
  profile_origin: [number, number];
  station_interval: number;
  elevation_interval: number;
  starting_chainage: number;
}

interface LongitudinalData {
  params: LongitudinalParams;
}

const props = defineProps<{
  modelValue: LongitudinalData;
}>();

const emit = defineEmits<{
  "update:model-value": [value: LongitudinalData];
  complete: [];
}>();

const route = useRoute();
const toast = useToast();
const loading = ref(false);

const local = reactive<LongitudinalData>({
  params: { ...props.modelValue.params },
});

// Validate that all required fields have valid values
const isValid = computed(() => {
  const p = local.params;
  return (
    p.horizontal_scale > 0 &&
    p.vertical_scale > 0 &&
    Array.isArray(p.profile_origin) &&
    p.profile_origin.length === 2 &&
    p.station_interval > 0 &&
    p.elevation_interval > 0 &&
    p.starting_chainage >= 0
  );
});

// Watch for changes and emit updates
watch(
  () => local,
  () => {
    emit("update:model-value", { params: { ...local.params } });
  },
  { deep: true }
);

// Fetch existing longitudinal profile parameters on mount
onMounted(async () => {
  try {
    const planId = route.params.plan as string;
    if (planId) {
      const { $axios } = useNuxtApp();
      const response = await $axios.get(`/plan/fetch/${planId}`);

      if (response.data?.data?.longitudinal_profile_parameters) {
        const params = response.data.data.longitudinal_profile_parameters;
        local.params = {
          horizontal_scale: params.horizontal_scale ?? 1.0,
          vertical_scale: params.vertical_scale ?? 10,
          profile_origin: Array.isArray(params.profile_origin)
            ? [params.profile_origin[0] ?? 0, params.profile_origin[1] ?? 0]
            : [0, 0],
          station_interval: params.station_interval ?? 10,
          elevation_interval: params.elevation_interval ?? 1,
          starting_chainage: params.starting_chainage ?? 0.0,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch longitudinal profile parameters:", error);
    // Don't show error toast as this is optional background loading
  }
});

async function saveAndContinue() {
  if (!isValid.value || loading.value) return;

  try {
    loading.value = true;
    const planId = route.params.plan as string;
    const { $axios } = useNuxtApp();

    // Prepare payload for API
    const payload = {
      horizontal_scale: local.params.horizontal_scale,
      vertical_scale: local.params.vertical_scale,
      profile_origin: local.params.profile_origin,
      station_interval: local.params.station_interval,
      elevation_interval: local.params.elevation_interval,
      starting_chainage: local.params.starting_chainage,
    };

    // Save longitudinal profile parameters to API
    await $axios.put(`/plan/route/longitudinal/params/edit/${planId}`, payload);

    toast.add({
      title: "Longitudinal profile parameters saved successfully",
      color: "success",
    });

    emit("complete");
  } catch (error: any) {
    console.error("Failed to save longitudinal profile parameters:", error);
    toast.add({
      title: "Failed to save longitudinal profile parameters",
      description:
        error.response?.data?.message || error.message || "Please try again",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>
