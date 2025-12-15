<template>
  <UserHeader />

  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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
        Differential Leveling
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Calculate reduced levels and height differences without creating a plan
      </p>

      <!-- Differential Leveling Table -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <!-- Method Selection -->
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Leveling Method
          </label>
          <select
            v-model="levelingMethod"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-green-500"
          >
            <option value="height-of-instrument">Height of Instrument</option>
            <option value="rise-and-fall">Rise and Fall</option>
          </select>
        </div>

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
                Import data (CSV or TXT or XLS/XLSX)
              </div>
              <div class="text-[11px] text-gray-600 dark:text-gray-400">
                Columns: Station, Back Sight, Intermediate Sight, Fore Sight, Reduced Level
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                Supports comma, tab, or space separated files with optional headers
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              ref="fileInputRef"
              type="file"
              accept=".csv,.txt,.xls,.xlsx"
              @change="onFileUpload"
              class="hidden"
            />
            <button
              type="button"
              @click="triggerFileUpload"
              class="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload File
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700/60"
              @click="downloadTemplate"
            >
              Download Template
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Leveling Data
          </h2>
          <button
            @click="addRow"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Row
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Station
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Back Sight(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Intermediate Sight(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Fore Sight(m)
                </th>
                <th
                  v-if="levelingMethod === 'height-of-instrument'"
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Height of Instrument(m)
                </th>
                <th
                  v-if="levelingMethod === 'rise-and-fall'"
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Rise(m)
                </th>
                <th
                  v-if="levelingMethod === 'rise-and-fall'"
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Fall(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Reduced Level(m)
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
                v-for="(row, index) in levelingRows"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="py-3 px-4">
                  <input
                    v-model="row.station"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-green-500"
                    placeholder="BM1"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.backSight"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-green-500"
                    placeholder="1.234"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.intermediateSight"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-green-500"
                    placeholder="2.345"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.foreSight"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-green-500"
                    placeholder="3.456"
                  />
                </td>
                <td v-if="levelingMethod === 'height-of-instrument'" class="py-3 px-4">
                  <input
                    v-model="row.heightOfInstrument"
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                  />
                </td>
                <td v-if="levelingMethod === 'rise-and-fall'" class="py-3 px-4">
                  <input
                    v-model="row.rise"
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                  />
                </td>
                <td v-if="levelingMethod === 'rise-and-fall'" class="py-3 px-4">
                  <input
                    v-model="row.fall"
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.reducedLevel"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-green-500"
                    placeholder="100.000"
                    :readonly="index !== 0"
                    :class="{ 'bg-gray-50 dark:bg-slate-600': index !== 0 }"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="removeRow(index)"
                    class="p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Compute Button -->
        <div class="flex items-center gap-4 mt-6">
          <button
            @click="performComputation"
            :disabled="!canCompute || isComputing"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span v-if="isComputing" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isComputing ? "Computing..." : "Compute" }}
          </button>

          <button
            v-if="computationResults"
            @click="downloadComputationCSV"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Download Results
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

      <!-- Results Section -->
      <div
        v-if="computationResults && !computationError"
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Computation Results
        </h2>

        <!-- Summary Information -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Arithmetic Check
            </h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">ΣBS - ΣFS:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ computationResults.arithmetic_check?.toFixed(3) || "0.000" }} m
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Last RL - First RL:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ computationResults.rl_difference?.toFixed(3) || "0.000" }} m
                </span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Totals
            </h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total BS:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ computationResults.total_bs?.toFixed(3) || "0.000" }} m
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total FS:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ computationResults.total_fs?.toFixed(3) || "0.000" }} m
                </span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Status
            </h4>
            <div class="text-xs">
              <span :class="computationResults.is_balanced ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-semibold">
                {{ computationResults.is_balanced ? "✓ Balanced" : "✗ Not Balanced" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RiArrowLeftLine, RiDeleteBinLine } from "@remixicon/vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { ref, computed } from "vue";
import { parseTable } from "~/composables/useSheetParser";

definePageMeta({ middleware: ["auth"] });

const toast = useToast();
const route = useRoute();
const projectId = route.params.id as string;

// Reactive data
const levelingMethod = ref<"height-of-instrument" | "rise-and-fall">("height-of-instrument");
const levelingRows = ref([
  {
    station: "",
    backSight: null as number | null,
    intermediateSight: null as number | null,
    foreSight: null as number | null,
    heightOfInstrument: "",
    rise: "",
    fall: "",
    reducedLevel: null as number | null,
  },
]);

const fileInputRef = ref<HTMLInputElement | null>(null);
const computationResults = ref<any>(null);
const computationError = ref("");
const isComputing = ref(false);

// Computed properties
const canCompute = computed(() => {
  return levelingRows.value.some(
    (row) => row.station && row.station.trim() !== ""
  );
});

// Methods
const addRow = () => {
  levelingRows.value.push({
    station: "",
    backSight: null,
    intermediateSight: null,
    foreSight: null,
    heightOfInstrument: "",
    rise: "",
    fall: "",
    reducedLevel: null,
  });
};

const removeRow = (index: number) => {
  if (levelingRows.value.length > 1) {
    levelingRows.value.splice(index, 1);
  } else if (levelingRows.value.length === 1) {
    levelingRows.value[0] = {
      station: "",
      backSight: null,
      intermediateSight: null,
      foreSight: null,
      heightOfInstrument: "",
      rise: "",
      fall: "",
      reducedLevel: null,
    };
  }
};

const performComputation = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;

    // Prepare observations
    const observations = levelingRows.value
      .filter((row) => row.station && row.station.trim() !== "")
      .map((row) => ({
        station: row.station,
        back_sight: row.backSight !== null ? Number(row.backSight) : null,
        intermediate_sight: row.intermediateSight !== null ? Number(row.intermediateSight) : null,
        fore_sight: row.foreSight !== null ? Number(row.foreSight) : null,
        reduced_level: row.reducedLevel !== null ? Number(row.reducedLevel) : null,
      }));

    if (observations.length < 2) {
      throw new Error("Please provide at least 2 observations");
    }

    // Check if first row has reduced level
    if (!observations[0] || observations[0].reduced_level === null) {
      throw new Error("First station must have a reduced level (benchmark)");
    }

    const payload = {
      method: levelingMethod.value,
      observations,
    };

    // Make API call
    const { $axios } = useNuxtApp();
    const response = await $axios.post("/leveling/differential", payload);

    computationResults.value = response.data?.data;

    // Update the table with computed values
    if (response.data?.data?.observations) {
      response.data.data.observations.forEach((obs: any, index: number) => {
        if (levelingRows.value[index]) {
          levelingRows.value[index].heightOfInstrument = obs.height_of_instrument?.toFixed(3) || "";
          levelingRows.value[index].rise = obs.rise?.toFixed(3) || "";
          levelingRows.value[index].fall = obs.fall?.toFixed(3) || "";
          levelingRows.value[index].reducedLevel = obs.reduced_level;
        }
      });
    }

    toast.add({
      title: "Differential leveling completed successfully",
      color: "success",
    });
  } catch (error: any) {
    console.error("Differential leveling error:", error);
    computationError.value =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during computation";
  } finally {
    isComputing.value = false;
  }
};

const downloadComputationCSV = () => {
  if (!levelingRows.value || levelingRows.value.length === 0) {
    toast.add({
      title: "No computation data to download",
      color: "warning",
    });
    return;
  }

  let header = "Station,Back Sight(m),Intermediate Sight(m),Fore Sight(m),";
  if (levelingMethod.value === "height-of-instrument") {
    header += "Height of Instrument(m),";
  } else {
    header += "Rise(m),Fall(m),";
  }
  header += "Reduced Level(m)";

  const csvRows = levelingRows.value
    .filter((row) => row.station && row.station.trim() !== "")
    .map((row) => {
      const bs = row.backSight !== null ? row.backSight.toFixed(3) : "";
      const is = row.intermediateSight !== null ? row.intermediateSight.toFixed(3) : "";
      const fs = row.foreSight !== null ? row.foreSight.toFixed(3) : "";
      const rl = row.reducedLevel !== null ? row.reducedLevel.toFixed(3) : "";

      let middleCols = "";
      if (levelingMethod.value === "height-of-instrument") {
        middleCols = `${row.heightOfInstrument || ""},`;
      } else {
        middleCols = `${row.rise || ""},${row.fall || ""},`;
      }

      return `${row.station},${bs},${is},${fs},${middleCols}${rl}`;
    });

  const csvContent = [header, ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `differential_leveling_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  toast.add({
    title: "Computation data downloaded successfully",
    color: "success",
  });
};

// File upload methods
const triggerFileUpload = () => {
  fileInputRef.value?.click();
};

const parseLevelingCSV = async (input: string | ArrayBuffer | any) => {
  const rows = await parseTable(input);
  if (!rows || rows.length === 0) return [];

  const firstRow = Array.isArray(rows[0])
    ? rows[0].map((c: any) => String(c ?? "").toLowerCase()).join(" ")
    : String(rows[0] ?? "").toLowerCase();
  const hasHeader = /station|back|sight|fore|intermediate|reduced|level/i.test(firstRow);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const parsedRows: any[] = [];
  for (const colsRaw of dataRows) {
    const cols = (colsRaw || []).map((c: any) => String(c ?? "").trim());
    if (cols.length < 5) continue;

    const station = String(cols[0] || "").trim();
    const backSight = cols[1] && cols[1] !== "" ? parseFloat(cols[1]) : null;
    const intermediateSight = cols[2] && cols[2] !== "" ? parseFloat(cols[2]) : null;
    const foreSight = cols[3] && cols[3] !== "" ? parseFloat(cols[3]) : null;
    const reducedLevel = cols[4] && cols[4] !== "" ? parseFloat(cols[4]) : null;

    if (station) {
      parsedRows.push({
        station,
        backSight,
        intermediateSight,
        foreSight,
        heightOfInstrument: "",
        rise: "",
        fall: "",
        reducedLevel,
      });
    }
  }
  return parsedRows;
};

const onFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  try {
    if (ext === ".xls" || ext === ".xlsx") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const parsed = await parseLevelingCSV(arrayBuffer);
        levelingRows.value = parsed.length > 0 ? parsed : levelingRows.value;
        toast.add({
          title: "File imported successfully",
          color: "success",
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const parsed = await parseLevelingCSV(text);
        levelingRows.value = parsed.length > 0 ? parsed : levelingRows.value;
        toast.add({
          title: "File imported successfully",
          color: "success",
        });
      };
      reader.readAsText(file);
    }
  } catch (err) {
    console.error("File import error:", err);
    toast.add({
      title: "Failed to import file",
      color: "error",
    });
  } finally {
    // Reset file input
    if (target) target.value = "";
  }
};

const downloadTemplate = () => {
  const csv = [
    "Station,Back Sight,Intermediate Sight,Fore Sight,Reduced Level",
    "BM1,1.525,,,100.000",
    "CP1,,,1.835,",
    "TP1,1.645,,1.935,",
    "CP2,,,1.455,",
    "BM2,,,1.755,",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "differential_leveling_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};
</script>
