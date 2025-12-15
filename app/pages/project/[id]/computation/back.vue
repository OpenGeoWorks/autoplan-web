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
        Back Computation
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Calculate bearings and distances from known coordinates without creating a plan
      </p>

      <!-- Coordinates Input Section -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <!-- File Upload Section -->
        <div
          class="flex items-center justify-between gap-3 p-3 rounded-md border border-orange-200 dark:border-slate-700 bg-orange-50/70 dark:bg-slate-800/50 mb-4"
        >
          <div class="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5 text-orange-600 dark:text-orange-400"
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
                Columns: Point ID, Easting, Northing
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                Supports comma, tab, or space separated files with optional
                headers
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
              class="px-3 py-1.5 text-xs rounded bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload File
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700/60"
              @click="downloadTemplate"
            >
              Download Template
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Input Coordinates
          </h2>
          <button
            @click="addCoordinate"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Point
          </button>
        </div>

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
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-orange-500"
                    placeholder="A"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="coord.easting"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-orange-500"
                    placeholder="622885.055"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="coord.northing"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-orange-500"
                    placeholder="860071.644"
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

        <!-- Compute Button -->
        <div class="flex items-center gap-4 mt-6">
          <button
            @click="performComputation"
            :disabled="!canCompute || isComputing"
            class="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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

        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="text-left border-b border-gray-200 dark:border-slate-700">
                <th class="px-2 py-3 font-medium text-gray-700 dark:text-gray-300">Distance (m)</th>
                <th class="px-2 py-3 font-medium text-gray-700 dark:text-gray-300">Bearing</th>
                <th class="px-2 py-3 font-medium text-gray-700 dark:text-gray-300">Departure</th>
                <th class="px-2 py-3 font-medium text-gray-700 dark:text-gray-300">Latitude</th>
                <th class="px-2 py-3 font-medium text-gray-700 dark:text-gray-300">ID</th>
                <th class="px-2 py-3 font-medium text-gray-700 dark:text-gray-300">Easting (mE)</th>
                <th class="px-2 py-3 font-medium text-gray-700 dark:text-gray-300">Northing (mN)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100 dark:border-slate-600">
                <td class="px-2 py-3"></td>
                <td class="px-2 py-3"></td>
                <td class="px-2 py-3"></td>
                <td class="px-2 py-3"></td>
                <td class="px-2 py-3">{{ legs[0]?.from?.id }}</td>
                <td class="px-2 py-3">{{ legs[0]?.from?.easting?.toFixed(3) }}</td>
                <td class="px-2 py-3">{{ legs[0]?.from?.northing?.toFixed(3) }}</td>
              </tr>
              <tr v-for="(leg, i) in legs" :key="i" class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="px-2 py-3">{{ leg.distance?.toFixed(3) }}</td>
                <td class="px-2 py-3">
                  {{ formatBearing(leg.bearing?.decimal) }}
                </td>
                <td class="px-2 py-3">{{ leg.delta_easting?.toFixed(3) }}</td>
                <td class="px-2 py-3">{{ leg.delta_northing?.toFixed(3) }}</td>
                <td class="px-2 py-3">{{ leg.to?.id }}</td>
                <td class="px-2 py-3">{{ leg.to?.easting?.toFixed(3) }}</td>
                <td class="px-2 py-3">{{ leg.to?.northing?.toFixed(3) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Traverse Summary
            </h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total Distance:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ traverse?.total_distance?.toFixed(3) || "0.000" }} m
                </span>
              </div>
              <div v-if="traverse?.area" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Area:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ formatArea(traverse.area) }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Bounding Box
            </h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Min Northing:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ traverse?.bounding_box?.min_northing?.toFixed(3) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Max Northing:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ traverse?.bounding_box?.max_northing?.toFixed(3) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Min Easting:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ traverse?.bounding_box?.min_easting?.toFixed(3) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Max Easting:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ traverse?.bounding_box?.max_easting?.toFixed(3) }}
                </span>
              </div>
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
const coordinates = ref([
  {
    id: "",
    easting: 0,
    northing: 0,
  },
]);

const fileInputRef = ref<HTMLInputElement | null>(null);

const computationResults = ref<any>(null);
const computationError = ref("");
const isComputing = ref(false);
const legs = ref<any[]>([]);
const traverse = ref<any | null>(null);

// Computed properties
const canCompute = computed(() => {
  return coordinates.value.some(
    (coord) =>
      coord.id &&
      coord.id.trim() !== "" &&
      coord.northing !== null &&
      coord.easting !== null
  );
});

// Methods
const addCoordinate = () => {
  coordinates.value.push({
    id: "",
    easting: 0,
    northing: 0,
  });
};

const removeCoordinate = (index: number) => {
  if (coordinates.value.length > 1) {
    coordinates.value.splice(index, 1);
  } else if (coordinates.value.length === 1) {
    coordinates.value[0] = { id: "", easting: 0, northing: 0 };
  }
};

const performComputation = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;
    legs.value = [];
    traverse.value = null;

    // Filter and prepare points
    const points = coordinates.value
      .filter((coord) => coord.id && coord.id.trim() !== "")
      .map((coord) => ({
        id: coord.id,
        easting: Number(coord.easting),
        northing: Number(coord.northing),
      }));

    if (points.length < 2) {
      throw new Error("Please provide at least 2 points with valid coordinates");
    }

    // Ensure closed polygon: repeat first point at end if not already closed
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    if (points.length && firstPoint && lastPoint && firstPoint.id !== lastPoint.id) {
      points.push({ 
        id: firstPoint.id,
        easting: firstPoint.easting,
        northing: firstPoint.northing
      });
    }

    const payload = { points };

    // Make API call
    const { $axios } = useNuxtApp();
    const response = await $axios.post("/traverse/back-computation", payload);

    const data = response?.data?.data;
    legs.value = data?.traverse_legs || [];
    traverse.value = data?.traverse || null;
    computationResults.value = response.data;

    toast.add({
      title: "Back computation completed successfully",
      color: "success",
    });
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

const formatBearing = (decimalDeg: number | null | undefined) => {
  if (
    decimalDeg === null ||
    decimalDeg === undefined ||
    Number.isNaN(decimalDeg)
  )
    return "";
  const absDeg = Math.abs(decimalDeg);
  let deg = Math.floor(absDeg);
  const minutesFloat = (absDeg - deg) * 60;
  let minutes = Math.floor(minutesFloat);
  let secondsFloat = Math.round((minutesFloat - minutes) * 60);
  const sign = decimalDeg < 0 ? "-" : "";

  if (secondsFloat >= 59.9999999999) {
    secondsFloat = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    deg += 1;
  }

  let secondsStr = secondsFloat.toFixed(6).replace(/\.?(0+)$/, "");
  return `${sign}${deg}° ${minutes}' ${secondsStr}"`;
};

const formatArea = (area: number | null | undefined) => {
  if (area === null || area === undefined || Number.isNaN(area)) return "";

  if (area >= 10000) {
    const hectares = area / 10000;
    return `${area.toFixed(3)} sqm (${hectares.toFixed(3)} hectares)`;
  }

  return `${area.toFixed(3)} sqm`;
};

const downloadComputationCSV = () => {
  if (!legs.value || legs.value.length === 0) {
    toast.add({
      title: "No computation data to download",
      color: "warning",
    });
    return;
  }

  const header = "From,To,Distance(m),Bearing,Departure,Latitude,ID,Easting(mE),Northing(mN)";

  const csvRows = legs.value.map((leg) => {
    const fromId = leg.from?.id || "";
    const toId = leg.to?.id || "";
    const distance = leg.distance?.toFixed(3) || "";
    const bearing = formatBearing(leg.bearing?.decimal) || "";
    const departure = leg.delta_easting?.toFixed(3) || "";
    const latitude = leg.delta_northing?.toFixed(3) || "";
    const id = leg.to?.id || "";
    const easting = leg.to?.easting?.toFixed(3) || "";
    const northing = leg.to?.northing?.toFixed(3) || "";

    return `${fromId},${toId},${distance},"${bearing}",${departure},${latitude},${id},${easting},${northing}`;
  });

  const csvContent = [header, ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `back_computation_${new Date().toISOString().split("T")[0]}.csv`;
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

const parseCoordinatesCSV = async (input: string | ArrayBuffer | any) => {
  const rows = await parseTable(input);
  if (!rows || rows.length === 0) return [];

  const firstRow = Array.isArray(rows[0])
    ? rows[0].map((c: any) => String(c ?? "").toLowerCase()).join(" ")
    : String(rows[0] ?? "").toLowerCase();
  const hasHeader = /point|id|north|east/i.test(firstRow);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const parsedCoords: any[] = [];
  for (const colsRaw of dataRows) {
    const cols = (colsRaw || []).map((c: any) => String(c ?? "").trim());
    if (cols.length < 3) continue;

    const id = String(cols[0] || "").trim();
    const easting = parseFloat(cols[1] || "0") || 0;
    const northing = parseFloat(cols[2] || "0") || 0;

    if (id) {
      parsedCoords.push({
        id,
        easting,
        northing,
      });
    }
  }
  return parsedCoords;
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
        const parsed = await parseCoordinatesCSV(arrayBuffer);
        coordinates.value = parsed.length > 0 ? parsed : coordinates.value;
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
        const parsed = await parseCoordinatesCSV(text);
        coordinates.value = parsed.length > 0 ? parsed : coordinates.value;
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
    "Point ID,Easting,Northing",
    "A,622885.055,860071.644",
    "B,622851.809,860056.227",
    "C,622888.916,860035.905",
    "D,622915.042,860077.957",
    "A,622885.055,860071.644",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "back_computation_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};
</script>
