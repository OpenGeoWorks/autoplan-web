<template>
  <UserHeader />

  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back -->
      <div class="mb-4">
        <button
          @click="navigateTo(`/project/${projectId}/plan/${planId}`)"
          class="inline-flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <RiArrowLeftLine class="w-4 h-4" />
          Back to Computation
        </button>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Edit Back Computation
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Adjust the known coordinates and recompute the bearings and distances
      </p>

      <!-- Loading -->
      <div
        v-if="isLoading"
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse space-y-3"
      >
        <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div class="h-8 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
        <div class="h-8 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
      </div>

      <div
        v-else
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Point ID
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Easting(mE)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Northing(mN)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Elevation(m)
                </th>
                <th
                  class="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in backRows"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="py-3 px-4">
                  <input
                    v-model="row.pointId"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="A"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.easting"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="543210.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.northing"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="712345.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.elevation"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="optional"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="deleteBackRow(index)"
                    class="p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between mt-4">
          <button
            @click="addBackRow"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Row
          </button>

          <label
            class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              type="checkbox"
              v-model="closeRing"
              class="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            Close the ring
          </label>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
          {{
            closeRing
              ? "A closing leg back to the first point is added, and the enclosed area is reported — use this for a parcel boundary."
              : "The legs are computed as an open chain and no area is reported — use this for a route or open traverse."
          }}
        </p>

        <div class="flex items-center gap-4 mt-6">
          <button
            @click="computeBack"
            :disabled="!canCompute || isComputing"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span
              v-if="isComputing"
              class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            {{ isComputing ? "Computing..." : "Compute" }}
          </button>

          <button
            v-if="computationResults"
            @click="showResultsModal = true"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View Results
          </button>

          <button
            @click="saveChanges"
            :disabled="!canCompute || isSaving"
            class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span
              v-if="isSaving"
              class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            {{ isSaving ? "Saving..." : "Save Changes" }}
          </button>
        </div>

        <div
          v-if="computationError"
          class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <h3 class="font-semibold text-red-800 dark:text-red-300 mb-2">
            Computation Error
          </h3>
          <p class="text-sm text-red-700 dark:text-red-300">
            {{ computationError }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <BackComputationResultsModal
    :show="showResultsModal"
    :results="computationResults?.data || null"
    :close-ring="closeRing"
    @close="showResultsModal = false"
  />
</template>

<script lang="ts" setup>
import { RiArrowLeftLine, RiDeleteBinLine } from "@remixicon/vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { ref, computed, onMounted } from "vue";
import BackComputationResultsModal from "~/components/BackComputationResultsModal.vue";

definePageMeta({ middleware: ["auth"] });

const toast = useToast();
const route = useRoute();
const projectId = route.params.id as string;
const planId = route.params.plan as string;

interface BackRow {
  pointId: string;
  easting: number | null;
  northing: number | null;
  elevation: number | null;
}

const emptyRow = (): BackRow => ({
  pointId: "",
  easting: null,
  northing: null,
  elevation: null,
});

const backRows = ref<BackRow[]>([emptyRow()]);
const closeRing = ref(true);
const computationResults = ref<any>(null);
const computationError = ref("");
const isLoading = ref(true);
const isComputing = ref(false);
const isSaving = ref(false);
const showResultsModal = ref(false);

const validPoints = computed(() =>
  backRows.value
    .filter(
      (row) =>
        row.pointId &&
        row.pointId.trim() !== "" &&
        row.easting !== null &&
        row.northing !== null
    )
    .map((row) => ({
      id: row.pointId.trim(),
      northing: row.northing as number,
      easting: row.easting as number,
      ...(row.elevation !== null ? { elevation: row.elevation } : {}),
    }))
);

const canCompute = computed(() => validPoints.value.length >= 2);

const addBackRow = () => {
  backRows.value.push(emptyRow());
};

const deleteBackRow = (index: number) => {
  if (backRows.value.length > 1) {
    backRows.value.splice(index, 1);
  }
};

const buildPoints = () => {
  const points = validPoints.value.map((p) => ({ ...p }));
  if (
    closeRing.value &&
    points.length > 2 &&
    points[0]!.id !== points[points.length - 1]!.id
  ) {
    points.push({ ...points[0]! });
  }
  return points;
};

const fetchPlanData = async () => {
  try {
    isLoading.value = true;
    const { $axios } = useNuxtApp();
    const response = await $axios.get(`/plan/fetch/${planId}`);
    const data = response.data?.data?.back_computation_data;

    if (data?.points?.length) {
      backRows.value = data.points.map((p: any) => ({
        pointId: p.id ?? "",
        easting: p.easting ?? null,
        northing: p.northing ?? null,
        elevation: p.elevation ?? null,
      }));
      // Stored as intent rather than as a repeated point, so an older record
      // without the flag falls back to the ring default.
      closeRing.value = data.close_ring !== false;
    }
  } catch (error: any) {
    console.error("Failed to load back computation:", error);
    toast.add({ title: "Failed to load computation", color: "error" });
  } finally {
    isLoading.value = false;
  }
};

const computeBack = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;

    const points = buildPoints();
    if (points.length < 2) {
      throw new Error(
        "Provide at least two points with a Point ID, easting and northing"
      );
    }

    const { $axios } = useNuxtApp();
    const response = await $axios.post("/traverse/back-computation", { points });

    computationResults.value = response.data;
    showResultsModal.value = true;
  } catch (error: any) {
    console.error("Back computation error:", error);
    computationError.value =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during computation";
  } finally {
    isComputing.value = false;
  }
};

const saveChanges = async () => {
  try {
    isSaving.value = true;
    const { $axios } = useNuxtApp();
    await $axios.put(`/plan/back-data/edit/${planId}`, {
      points: validPoints.value,
      close_ring: closeRing.value,
    });

    toast.add({ title: "Computation updated", color: "success" });
    navigateTo(`/project/${projectId}/plan/${planId}`);
  } catch (error: any) {
    console.error("Save computation error:", error);
    toast.add({
      title:
        error.response?.data?.message ||
        error.message ||
        "Failed to save computation",
      color: "error",
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchPlanData);
</script>
