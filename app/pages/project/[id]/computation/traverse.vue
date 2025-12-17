<template>
  <UserHeader />

  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back -->
      <div class="mb-4">
        <button
          @click="navigateTo(`/project/${projectId}`)"
          class="inline-flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <RiArrowLeftLine class="w-4 h-4" />
          Back to Project
        </button>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Traverse Computation
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Close traverses with angular misclosure corrections without creating a plan
      </p>

      <!-- Known Coordinates Table -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Known Coordinates
          </h2>
          <button
            @click="addCoordinate"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Point
          </button>
        </div>

        <div class="overflow-x-auto">
          <!-- Actual Table -->
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
                  Northing(mN)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Easting(mE)
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
                v-for="(coord, index) in coordinates"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="py-3 px-4">
                  <input
                    v-model="coord.id"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="KG|21"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="coord.northing"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="860071.644"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="coord.easting"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="622885.055"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="removeCoordinate(index)"
                    class="p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Observed Angles and Distances Table -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Observed Angles and Distances
        </h2>

        <!-- File Upload Section -->
        <div
          class="flex items-center justify-between gap-3 p-3 rounded-md border border-green-200 dark:border-slate-700 bg-green-50/70 dark:bg-slate-800/50 mb-4"
        >
          <div class="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5 text-green-600 dark:text-green-400"
            >
              <path
                d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 8.707 10.293L11 12.586V4a1 1 0 0 1 1-1z"
              />
              <path
                d="M4 15a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H6v3h12v-3h-1a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z"
              />
            </svg>
            <div>
              <div class="text-xs font-medium text-gray-800 dark:text-gray-200">
                Import observed angles (CSV or TXT or XLS/XLSX)
              </div>
              <div class="text-[11px] text-gray-600 dark:text-gray-400">
                Columns: From, To, Degrees, Minutes, Seconds, Distance
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              ref="angleFileInputRef"
              type="file"
              accept=".csv,.txt,.xls,.xlsx"
              @change="onAngleFile"
              class="hidden"
            />
            <button
              type="button"
              @click="triggerAngleFile"
              class="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700"
            >
              Upload File
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700/60"
              @click="downloadAngleTemplate"
            >
              Download Template
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  From
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  To
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Degrees
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Minutes
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Seconds
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Distance(m)
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
                v-for="(leg, index) in legs"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="py-3 px-4">
                  <input
                    v-model="leg.from.id"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="KG|22"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model="leg.to.id"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="PT1"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="leg.observed_angle.degrees"
                    type="number"
                    min="0"
                    max="359"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="232"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="leg.observed_angle.minutes"
                    type="number"
                    min="0"
                    max="59"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="41"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="leg.observed_angle.seconds"
                    type="number"
                    step="0.01"
                    min="0"
                    max="59.99"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="7"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="leg.distance"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="204.192"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="removeLeg(index)"
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
            @click="addLeg"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Leg
          </button>

          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                v-model="misclosureCorrection"
                class="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              Apply Misclosure Correction
            </label>
          </div>
        </div>

        <!-- Compute Button -->
        <div class="flex items-center gap-4 mt-6">
          <button
            @click="performComputation"
            :disabled="!canCompute || isComputing"
            class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span v-if="isComputing" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isComputing ? "Computing..." : "Compute Traverse" }}
          </button>

          <button
            v-if="computationResults"
            @click="showSaveModal = true"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Computation
          </button>
        </div>

        <!-- Error Section -->
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

  <!-- Save Computation Modal -->
  <SaveComputationModal
    v-model="showSaveModal"
    ref="saveModalRef"
    @save="saveComputation"
  />

  <!-- Results Modal -->
  <TraverseComputationResultsModal
    :show="showResultsModal"
    :results="computationResults?.data || null"
    @close="closeModal"
  />

  <!-- Save Computation Modal -->
  <SaveComputationModal
    v-model="showSaveModal"
    @save="saveComputation"
    ref="saveModalRef"
  />
</template>

<script lang="ts" setup>
import { RiArrowLeftLine, RiDeleteBinLine } from "@remixicon/vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { ref, computed } from "vue";
import TraverseComputationResultsModal from "~/components/TraverseComputationResultsModal.vue";
import SaveComputationModal from "~/components/SaveComputationModal.vue";
import { parseTable } from "~/composables/useSheetParser";

definePageMeta({ middleware: ["auth"] });

const toast = useToast();
const route = useRoute();
const projectId = route.params.id as string;

// Reactive data
const coordinates = ref([
  {
    id: "",
    northing: 0,
    easting: 0,
  },
]);

const legs = ref([
  {
    from: { id: "" },
    to: { id: "" },
    observed_angle: {
      degrees: 0,
      minutes: 0,
      seconds: 0,
    },
    distance: 0,
  },
]);
const misclosureCorrection = ref(true);
const computationResults = ref<any>(null);
const computationError = ref("");
const showResultsModal = ref(false);
const isComputing = ref(false);
const showSaveModal = ref(false);
const saveModalRef = ref<any>(null);
const angleFileInputRef = ref<HTMLInputElement | null>(null);

// Computed properties
const canCompute = computed(() => {
  const hasValidCoordinates =
    coordinates.value.length > 0 &&
    coordinates.value.some((coord) => coord.id && coord.id.trim() !== "");
  const hasValidLegs =
    legs.value.length > 0 &&
    legs.value.some((leg) => leg.from.id && leg.to.id && leg.distance > 0);

  return hasValidCoordinates && hasValidLegs;
});

// Methods
const addCoordinate = () => {
  coordinates.value.push({
    id: "",
    northing: 0,
    easting: 0,
  });
};

const removeCoordinate = (index: number) => {
  if (coordinates.value.length > 1) {
    coordinates.value.splice(index, 1);
  } else if (coordinates.value.length === 1) {
    coordinates.value[0] = { id: "", northing: 0, easting: 0 };
  }
};

const addLeg = () => {
  const previousLeg = legs.value[legs.value.length - 1];
  const fromId = previousLeg && previousLeg.to.id ? previousLeg.to.id : "";

  legs.value.push({
    from: { id: fromId },
    to: { id: "" },
    observed_angle: {
      degrees: 0,
      minutes: 0,
      seconds: 0,
    },
    distance: 0,
  });
};

const removeLeg = (index: number) => {
  if (legs.value.length > 1) {
    legs.value.splice(index, 1);
  }
};

const closeModal = () => {
  showResultsModal.value = false;
};

const performComputation = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;

    // Prepare the payload
    const payload = {
      coordinates: coordinates.value,
      legs: legs.value,
      misclosure_correction: misclosureCorrection.value,
    };

    // Make API call to traverse computation endpoint
    const { $axios } = useNuxtApp();
    const response = await $axios.post(
      "/traverse/traverse-computation",
      payload
    );

    computationResults.value = response.data;
    showResultsModal.value = true;

    toast.add({
      title: "Traverse computation completed successfully",
      color: "success",
    });
  } catch (error: any) {
    console.error("Traverse computation error:", error);
    computationError.value =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during computation";
  } finally {
    isComputing.value = false;
  }
};

// File upload methods for observed angle and distance data
const triggerAngleFile = () => {
  angleFileInputRef.value?.click();
};

const parseAngleCSV = async (input: string | ArrayBuffer | any) => {
  const rows = await parseTable(input);
  if (!rows || rows.length === 0) return [];

  const firstRow = Array.isArray(rows[0])
    ? rows[0].map((c: any) => String(c ?? "").toLowerCase()).join(" ")
    : String(rows[0] ?? "").toLowerCase();
  const hasHeader = /from|to|deg|min|sec|dist|angle|point/i.test(firstRow);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const parsedLegs: any[] = [];
  for (const row of dataRows) {
    const cols = (row || []).map((c: any) => String(c ?? "").trim());
    if (cols.length < 5) continue;

    const fromId = cols[0];
    const toId = cols[1];

    const degrees = parseInt(String(cols[2] ?? "0")) || 0;
    const validDegrees = Math.max(0, Math.min(359, degrees));

    const minutes = parseInt(String(cols[3] ?? "0")) || 0;
    const validMinutes = Math.max(0, Math.min(59, minutes));

    const seconds = parseFloat(String(cols[4] ?? "0")) || 0;
    const validSeconds = Math.max(0, Math.min(59.999999, seconds));

    const distance = cols[5] ? parseFloat(String(cols[5])) || 0 : 0;
    const validDistance = Math.max(0, distance);

    if (fromId && toId) {
      parsedLegs.push({
        from: { id: fromId },
        to: { id: toId },
        observed_angle: {
          degrees: validDegrees,
          minutes: validMinutes,
          seconds: validSeconds,
        },
        distance: validDistance,
      });
    }
  }

  return parsedLegs;
};

const onAngleFile = (ev: Event) => {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const allowedTypes = [".csv", ".txt", ".xls", ".xlsx"];
  const fileExtension = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    toast.add({
      title: "Invalid file type. Please upload CSV, TXT or Excel.",
      color: "error",
    });
    if (angleFileInputRef.value) angleFileInputRef.value.value = "";
    return;
  }

  if (fileExtension === ".xls" || fileExtension === ".xlsx") {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const parsedLegs = await parseAngleCSV(arrayBuffer);
        if (parsedLegs.length) {
          legs.value = parsedLegs;
          toast.add({
            title: `Successfully imported ${parsedLegs.length} observed angle and distance entries from Excel`,
            color: "success",
          });
        } else {
          toast.add({
            title:
              "No valid data found in the Excel file. Please check the format and try again.",
            color: "warning",
          });
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast.add({
          title:
            "Error reading Excel file. Please check the file and try again.",
          color: "error",
        });
      } finally {
        if (angleFileInputRef.value) angleFileInputRef.value.value = "";
      }
    };
    reader.onerror = () => {
      toast.add({
        title: "Failed to read the file. Please try again.",
        color: "error",
      });
      if (angleFileInputRef.value) angleFileInputRef.value.value = "";
    };
    reader.readAsArrayBuffer(file);
  } else {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = String(reader.result || "");
        const parsedLegs = await parseAngleCSV(text);
        if (parsedLegs.length) {
          legs.value = parsedLegs;
          toast.add({
            title: `Successfully imported ${parsedLegs.length} observed angle and distance entries`,
            color: "success",
          });
        } else {
          toast.add({
            title:
              "No valid data found in the file. Please check the format and try again.",
            color: "warning",
          });
        }
      } catch (error) {
        console.error("Error reading file:", error);
        toast.add({
          title:
            "Error reading file. Please check the file format and try again.",
          color: "error",
        });
      } finally {
        if (angleFileInputRef.value) angleFileInputRef.value.value = "";
      }
    };
    reader.onerror = () => {
      toast.add({
        title: "Failed to read the file. Please try again.",
        color: "error",
      });
      if (angleFileInputRef.value) angleFileInputRef.value.value = "";
    };
    reader.readAsText(file);
  }
};

const downloadAngleTemplate = () => {
  const csv = [
    "From,To,Degrees,Minutes,Seconds,Distance",
    "KG|22,PT1,232,41,7,204.192",
    "PT1,PT2,165,20,43,119.950",
    "PT2,PT3,280,0,47,208.951",
    "PT3,PT4,281,30,31,249.537",
    "PT4,KG|21,188,43,49,173.164",
    "KG|21,KG|22,291,42,51,",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "observed_angle_distance_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const saveComputation = async (name: string) => {
  if (!saveModalRef.value) return;

  try {
    saveModalRef.value.setLoading(true);
    saveModalRef.value.setError("");

    // Step 1: Create a computation-only plan
    const { $axios } = useNuxtApp();
    const planResponse = await $axios.post("/plan/create", {
      name,
      project: projectId,
      computation_only: true,
    });

    const planId = planResponse.data?.data?.id;
    if (!planId) {
      throw new Error("Failed to create computation plan");
    }

    // Step 2: Save traverse data
    const traverseData = {
      coordinates: coordinates.value,
      legs: legs.value,
      apply_misclosure_correction: misclosureCorrection.value,
    };

    await $axios.put(`/plan/traverse-data/edit/${planId}`, traverseData);

    saveModalRef.value.close();
    toast.add({
      title: "Computation saved successfully",
      color: "success",
    });

    // Navigate to the saved computation
    setTimeout(() => {
      navigateTo(`/project/${projectId}/plan/${planId}`);
    }, 500);
  } catch (error: any) {
    console.error("Save computation error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to save computation";
    saveModalRef.value.setError(errorMessage);
  } finally {
    saveModalRef.value.setLoading(false);
  }
};
</script>
