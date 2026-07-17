<template>
  <div class="space-y-6">
    <h2 class="text-lg font-semibold">Topographic Settings</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left column -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-3">
            <input
              type="checkbox"
              v-model="local.show_spot_heights"
              class="form-checkbox h-4 w-4"
            />
            <span class="text-sm font-medium">Show spot heights</span>
          </label>
          <span class="text-xs text-gray-500"
            >Toggle display of point elevations</span
          >
        </div>

        <div>
          <label class="text-xs text-gray-600 mb-1 flex items-center gap-1"
            >Spot height label size
            <InfoTip text="Text height (in metres on the ground) of the elevation value written beside each surveyed point." /></label
          >
          <input
            v-model.number="local.point_label_scale"
            type="number"
            step="0.01"
            class="w-full px-3 py-2 rounded border bg-white dark:bg-slate-800"
          />
        </div>

        <div class="flex items-center justify-between mt-2">
          <label class="flex items-center gap-3">
            <input
              type="checkbox"
              v-model="local.show_contours"
              class="form-checkbox h-4 w-4"
            />
            <span class="text-sm font-medium">Show contours</span>
          </label>
          <span class="text-xs text-gray-500"
            >Generate contour lines from TIN</span
          >
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-gray-600 mb-1 flex items-center gap-1"
              >Contour interval
              <InfoTip text="Vertical spacing between contour lines, in metres. Smaller intervals show more detail; 0.5 m or 1 m are common." /></label
            >
            <input
              v-model.number="local.contour_interval"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 rounded border bg-white dark:bg-slate-800"
            />
          </div>
          <div>
            <label class="text-xs text-gray-600 mb-1 flex items-center gap-1"
              >Major contour
              <InfoTip text="Every contour at a multiple of this elevation is drawn thicker and labelled — usually 5x the contour interval." /></label
            >
            <input
              v-model.number="local.major_contour"
              type="number"
              step="1"
              class="w-full px-3 py-2 rounded border bg-white dark:bg-slate-800"
            />
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-4">
        <!-- <div>
          <label class="block text-xs text-gray-600 mb-1"
            >Minimum distance</label
          >
          <input
            v-model.number="local.minimum_distance"
            type="number"
            step="0.01"
            class="w-full px-3 py-2 rounded border bg-white dark:bg-slate-800"
          />
        </div> -->

        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            v-model="local.show_contours_labels"
            class="form-checkbox h-4 w-4"
          />
          <label class="text-sm font-medium">Show contour labels</label>
        </div>

        <div>
          <label class="text-xs text-gray-600 mb-1 flex items-center gap-1"
            >Contour label size
            <InfoTip text="Text height of the elevation labels written along major contours." /></label
          >
          <input
            v-model.number="local.contour_label_scale"
            type="number"
            step="0.01"
            class="w-full px-3 py-2 rounded border bg-white dark:bg-slate-800"
          />
        </div>

        <div class="mt-2">
          <label class="text-xs text-gray-600 mb-1 flex items-center gap-1">Surface
            <InfoTip text="How elevations between your points are estimated: TIN joins points into triangles (best for irregular data); Grid interpolates a smooth regular mesh (best for even coverage)." /></label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                name="surface"
                value="tin"
                v-model="local.selected_surface"
                class="form-radio h-4 w-4"
              />
              <span class="text-sm font-medium">TIN</span>
            </label>

            <label class="flex items-center gap-2">
              <input
                type="radio"
                name="surface"
                value="grid"
                v-model="local.selected_surface"
                class="form-radio h-4 w-4"
              />
              <span class="text-sm font-medium">Grid</span>
            </label>
          </div>
        </div>

        <div class="mt-2">
          <label class="text-xs text-gray-600 mb-1 flex items-center gap-1">Overlays
            <InfoTip text="Draw these reference layers on the plan. They can also be toggled per layer in CAD." /></label>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="local.show_tin_mesh"
                class="form-checkbox h-4 w-4"
              />
              <span class="text-sm font-medium flex items-center gap-1">Show TIN mesh
                <InfoTip text="Draws the triangulated irregular network joining your survey points." /></span>
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="local.show_grid"
                class="form-checkbox h-4 w-4"
              />
              <span class="text-sm font-medium flex items-center gap-1">Show coordinate grid
                <InfoTip text="Draws a rectangular easting/northing reference grid over the survey extent." /></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Perimeter Survey Settings -->
    <div class="border-t pt-6 mt-6">
      <h3 class="text-base font-semibold mb-2">Perimeter Survey Settings</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Configure display settings for the perimeter survey boundary
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              v-model="local.show_boundary"
              class="form-checkbox h-4 w-4"
            />
            <label class="text-sm font-medium">Show perimeter</label>
          </div>
        </div>

        <!-- <div class="space-y-4">
          <div>
            <label class="block text-xs text-gray-600 mb-1"
              >Perimeter label size</label
            >
            <input
              v-model.number="local.boundary_label_scale"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 rounded border bg-white dark:bg-slate-800"
            />
          </div>
        </div> -->
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button
        @click="onSave"
        :disabled="submitting"
        class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
      >
        {{ submitting ? "Saving..." : "Save & Continue" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from "vue";
import axios from "axios";
import InfoTip from "~/components/InfoTip.vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  modelValue: { settings: any };
  loading?: boolean;
}>();
const emit = defineEmits(["update:modelValue", "complete"]);

const local = reactive<any>({
  show_spot_heights: true,
  point_label_scale: 0.2,
  show_contours: true,
  contour_interval: 1,
  major_contour: 5,
  minimum_distance: 0.1,
  show_contours_labels: true,
  contour_label_scale: 0.5,
  show_boundary: true,
  boundary_label_scale: 0.2,
  selected_surface: "",
  show_tin_mesh: false,
  show_grid: false,
});

const submitting = ref(false);
const route = useRoute();
const planId = String(route.params.plan || "");

watch(
  () => props.modelValue?.settings,
  (v) => {
    if (v && typeof v === "object") {
      // map incoming tin/grid booleans to selected_surface
      const mapped = { ...v } as any;
      if (v.tin) mapped.selected_surface = "tin";
      else if (v.grid) mapped.selected_surface = "grid";
      else mapped.selected_surface = "tin"; // default to tin when neither is set
      // remove old tin/grid keys if present to avoid overwriting
      delete mapped.tin;
      delete mapped.grid;
      Object.assign(local, mapped);
    }
  },
  { immediate: true, deep: true }
);

// emit changes upward when local changes
watch(
  () => local,
  (v) => {
    // emit settings while preserving backward-compatible tin/grid booleans
    const out = { ...v } as any;
    out.tin = v.selected_surface === "tin";
    out.grid = v.selected_surface === "grid";
    emit("update:modelValue", { settings: { ...out } });
  },
  { deep: true }
);

async function onSave() {
  if (submitting.value) return;
  submitting.value = true;
  try {
    const payload = {
      show_spot_heights: !!local.show_spot_heights,
      point_label_scale: Number(local.point_label_scale || 0),
      show_contours: !!local.show_contours,
      contour_interval: Number(local.contour_interval || 0),
      major_contour: Number(local.major_contour || 0),
      minimum_distance: Number(local.minimum_distance || 0),
      show_contours_labels: !!local.show_contours_labels,
      contour_label_scale: Number(local.contour_label_scale || 0),
      show_boundary: !!local.show_boundary,
      boundary_label_scale: Number(local.boundary_label_scale || 0),
      // map selected_surface back to the original tin/grid booleans
      tin: local.selected_surface === "tin",
      grid: local.selected_surface === "grid",
      show_tin_mesh: !!local.show_tin_mesh,
      show_grid: !!local.show_grid,
    };

    await axios.put(`/plan/topo/setting/edit/${planId}`, payload);
    // notify parent to advance
    emit("complete");
  } catch (err) {
    // best-effort: emit update so parent can show a toast if desired
    emit("update:modelValue", { settings: { ...local } });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped></style>
