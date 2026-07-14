<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Layout Design
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Auto-generate a subdivision inside the site boundary, or enter an
        already-designed layout (plot corner coordinates and plots).
      </p>
    </div>

    <!-- Mode selector -->
    <div class="flex gap-2">
      <button
        v-for="m in modes"
        :key="m.value"
        @click="local.mode = m.value"
        class="px-4 py-2 rounded-md text-sm font-medium border transition-colors"
        :class="
          local.mode === m.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
        "
      >
        {{ m.label }}
      </button>
    </div>

    <!-- ===================== GENERATE MODE ===================== -->
    <template v-if="local.mode === 'generate'">
      <!-- Plot module -->
      <div
        class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
      >
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Plot Module
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="field-label">
              Frontage (m)
              <InfoTip
                text="Width of each plot along the road. 15 m x 30 m is the standard 450 sqm plot; 18 m x 36 m gives 648 sqm."
              />
            </label>
            <input v-model.number="local.params.plot.frontage" type="number" step="0.5" min="1" class="field-input" />
          </div>
          <div>
            <label class="field-label">
              Depth (m)
              <InfoTip
                text="How far each plot extends back from the road. Two rows of plots sit back-to-back inside each block."
              />
            </label>
            <input v-model.number="local.params.plot.depth" type="number" step="0.5" min="1" class="field-input" />
          </div>
          <div>
            <label class="field-label">
              Minimum Plot Area (m²)
              <InfoTip
                text="Irregular edge plots (clipped by the boundary) smaller than this are discarded instead of sold."
              />
            </label>
            <input v-model.number="local.params.plot.min_area" type="number" step="10" min="0" class="field-input" />
          </div>
          <div>
            <label class="field-label">
              Leftover Strips
              <InfoTip
                text="What to do when a block doesn't divide evenly: make the leftover its own smaller plot, widen the last plot, or share it across all plots in the row."
              />
            </label>
            <select v-model="local.params.plot.remainder_strategy" class="field-input">
              <option value="add_to_last">Add to last plot</option>
              <option value="separate">Separate smaller plot</option>
              <option value="distribute">Distribute across row</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Roads -->
      <div
        class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
      >
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Roads
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="field-label">
              Major Road Width (m)
              <InfoTip
                text="The estate's spine road, running along the long axis of the site. 15 m right-of-way is typical."
              />
            </label>
            <input v-model.number="local.params.roads.major_width" type="number" step="0.5" min="0" class="field-input" />
          </div>
          <div>
            <label class="field-label">
              Collector Road Width (m)
              <InfoTip
                text="Cross streets that break long blocks and feed traffic to the major road. Typically 12 m."
              />
            </label>
            <input v-model.number="local.params.roads.collector_width" type="number" step="0.5" min="0" class="field-input" />
          </div>
          <div>
            <label class="field-label">
              Access Road Width (m)
              <InfoTip
                text="The smaller roads every plot fronts onto, between block strips. Typically 9 m."
              />
            </label>
            <input v-model.number="local.params.roads.access_width" type="number" step="0.5" min="0" class="field-input" />
          </div>
          <div>
            <label class="field-label">
              Major Road Name
              <InfoTip text="Printed along the spine road on the plan (e.g. Unity Avenue). Other roads are numbered automatically." />
            </label>
            <input v-model="local.params.roads.major_road_name" type="text" placeholder="Unity Avenue" class="field-input" />
          </div>
        </div>
      </div>

      <!-- Blocks -->
      <div
        class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
      >
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Blocks
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label class="field-label">
              Max Block Length (m)
              <InfoTip
                text="A cross street is inserted whenever a block would exceed this length, so residents never walk too far around a block."
              />
            </label>
            <input v-model.number="local.params.blocks.max_length" type="number" step="10" min="30" class="field-input" />
          </div>
          <div>
            <label class="field-label">
              Block Orientation
              <InfoTip
                text="Auto aligns blocks with the site's long axis (recommended). NS/EW force north-south or east-west blocks."
              />
            </label>
            <select v-model="local.params.blocks.orientation" class="field-input">
              <option value="auto">Auto (site's long axis)</option>
              <option value="ns">North–South</option>
              <option value="ew">East–West</option>
            </select>
          </div>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 pb-2">
            <input type="checkbox" v-model="local.params.blocks.double_loaded" class="rounded border-gray-300 dark:border-slate-600 text-blue-600" />
            <span class="flex items-center gap-1">
              Double-loaded blocks
              <InfoTip
                text="Two rows of plots back-to-back per block, each row facing its own road — the standard estate pattern. Turn off for single-row blocks."
              />
            </span>
          </label>
        </div>
      </div>

      <!-- Reserves -->
      <div
        class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
      >
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Reserves
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label class="field-label">
              Open Space (%)
              <InfoTip
                text="Percentage of the site reserved as open/green space — planning authorities commonly require 5–10%."
              />
            </label>
            <input v-model.number="local.params.reserves.open_space_percent" type="number" step="1" min="0" max="50" class="field-input" />
          </div>
          <div>
            <label class="field-label">
              Facilities
              <InfoTip
                text="Comma-separated community facilities to reserve land for, e.g. school, market. Each takes a full plot row near the centre."
              />
            </label>
            <input v-model="facilitiesText" type="text" placeholder="school, market" class="field-input" />
          </div>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 pb-2">
            <input type="checkbox" v-model="local.params.reserves.commercial_along_major" class="rounded border-gray-300 dark:border-slate-600 text-blue-600" />
            <span class="flex items-center gap-1">
              Commercial along major road
              <InfoTip
                text="Marks the plots fronting the spine road as commercial — the usual practice, since they carry the most traffic."
              />
            </span>
          </label>
        </div>
      </div>
    </template>

    <!-- ===================== DRAW MODE ===================== -->
    <template v-else>
      <!-- Corner register -->
      <div
        class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-3"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Plot Corner Coordinates
            <InfoTip
              text="Every plot corner and road point in the designed layout, each with a unique id (e.g. PB 101). Plots and roads below reference these ids."
            />
          </h3>
          <div class="flex gap-2">
            <button @click="downloadCornersTemplate" class="table-btn">Template</button>
            <label class="cursor-pointer">
              <input ref="cornersFileRef" type="file" accept=".csv,.txt,.xls,.xlsx" @change="(e) => onImport(e, 'corners')" class="hidden" />
              <span class="inline-block px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Import CSV</span>
            </label>
            <button @click="addCorner" class="table-btn">+ Add Point</button>
          </div>
        </div>
        <div class="overflow-x-auto max-h-72 border border-gray-200 dark:border-slate-700 rounded">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th class="px-3 py-2 text-left">Point ID</th>
                <th class="px-3 py-2 text-left">Northing (m)</th>
                <th class="px-3 py-2 text-left">Easting (m)</th>
                <th class="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in local.corners" :key="row._key" class="border-b border-gray-100 dark:border-slate-700/60">
                <td class="px-3 py-1.5">
                  <input v-model="row.point" type="text" placeholder="PB 101" class="w-28 cell-input" />
                </td>
                <td class="px-3 py-1.5">
                  <input v-model.number="row.northing" type="number" step="0.001" class="w-40 cell-input" />
                </td>
                <td class="px-3 py-1.5">
                  <input v-model.number="row.easting" type="number" step="0.001" class="w-40 cell-input" />
                </td>
                <td class="px-3 py-1.5">
                  <button @click="local.corners.splice(idx, 1)" class="text-red-500 hover:text-red-700 text-xs">✕</button>
                </td>
              </tr>
              <tr v-if="!local.corners.length">
                <td colspan="4" class="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No corner points yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Plots -->
      <div
        class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-3"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Plots
            <InfoTip
              text="Each plot lists its corner point ids in order around the plot (at least 3), plus its block letter, number, and land use."
            />
          </h3>
          <div class="flex gap-2">
            <button @click="downloadPlotsTemplate" class="table-btn">Template</button>
            <label class="cursor-pointer">
              <input ref="plotsFileRef" type="file" accept=".csv,.txt,.xls,.xlsx" @change="(e) => onImport(e, 'plots')" class="hidden" />
              <span class="inline-block px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Import CSV</span>
            </label>
            <button @click="addPlot" class="table-btn">+ Add Plot</button>
          </div>
        </div>
        <div class="overflow-x-auto max-h-72 border border-gray-200 dark:border-slate-700 rounded">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th class="px-3 py-2 text-left">Block</th>
                <th class="px-3 py-2 text-left">No.</th>
                <th class="px-3 py-2 text-left">
                  <span class="flex items-center gap-1">
                    Corner IDs
                    <InfoTip text="Select the corner points in order around the plot (at least 3). Points come from the corner coordinates table above." />
                  </span>
                </th>
                <th class="px-3 py-2 text-left">Use</th>
                <th class="px-3 py-2 text-left">
                  <span class="flex items-center gap-1">
                    Area (m²)
                    <InfoTip text="Calculated automatically from the corner points once at least 3 are selected. You can still overwrite it manually." />
                  </span>
                </th>
                <th class="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(plot, idx) in local.plots" :key="plot._key" class="border-b border-gray-100 dark:border-slate-700/60">
                <td class="px-3 py-1.5"><input v-model="plot.block" type="text" placeholder="A" class="w-16 cell-input" /></td>
                <td class="px-3 py-1.5"><input v-model.number="plot.number" type="number" min="1" class="w-16 cell-input" /></td>
                <td class="px-3 py-1.5">
                  <div class="flex flex-wrap items-center gap-1 max-w-xl">
                    <span v-for="(pid, i) in plot.ids" :key="`${plot._key}-${i}`" class="flex items-center gap-0.5">
                      <select v-model="plot.ids[i]" class="w-24 cell-input">
                        <option value="">--</option>
                        <option v-for="opt in registerIds" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                      <button
                        v-if="plot.ids.length > 1"
                        @click="plot.ids.splice(i, 1)"
                        class="text-red-500 hover:text-red-700 text-xs leading-none"
                        title="Remove this corner"
                      >✕</button>
                    </span>
                    <button @click="plot.ids.push('')" class="text-xs text-blue-600 hover:underline whitespace-nowrap">+ corner</button>
                  </div>
                </td>
                <td class="px-3 py-1.5">
                  <select v-model="plot.use" class="w-32 cell-input">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="open_space">Open space</option>
                    <option value="school">School</option>
                    <option value="market">Market</option>
                  </select>
                </td>
                <td class="px-3 py-1.5"><input v-model.number="plot.area" type="number" step="0.1" class="w-24 cell-input" /></td>
                <td class="px-3 py-1.5">
                  <button @click="local.plots.splice(idx, 1)" class="text-red-500 hover:text-red-700 text-xs">✕</button>
                </td>
              </tr>
              <tr v-if="!local.plots.length">
                <td colspan="6" class="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No plots yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Roads -->
      <div
        class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-3"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Roads (optional)
            <InfoTip
              text="Roads are drawn from centerline point ids (from the corner register) offset by half the width each side. Leave empty if roads are implied by the gaps between plots."
            />
          </h3>
          <div class="flex gap-2">
            <button @click="downloadRoadsTemplate" class="table-btn">Template</button>
            <label class="cursor-pointer">
              <input ref="roadsFileRef" type="file" accept=".csv,.txt,.xls,.xlsx" @change="(e) => onImport(e, 'roads')" class="hidden" />
              <span class="inline-block px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Import CSV</span>
            </label>
            <button @click="addRoad" class="table-btn">+ Add Road</button>
          </div>
        </div>
        <div class="overflow-x-auto max-h-60 border border-gray-200 dark:border-slate-700 rounded">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th class="px-3 py-2 text-left">Name</th>
                <th class="px-3 py-2 text-left">Width (m)</th>
                <th class="px-3 py-2 text-left">
                  <span class="flex items-center gap-1">
                    Centerline IDs
                    <InfoTip text="Select the points along the road centerline in order (at least 2), from the corner coordinates table above." />
                  </span>
                </th>
                <th class="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(road, idx) in local.roads" :key="road._key" class="border-b border-gray-100 dark:border-slate-700/60">
                <td class="px-3 py-1.5"><input v-model="road.name" type="text" placeholder="Road 1" class="w-36 cell-input" /></td>
                <td class="px-3 py-1.5"><input v-model.number="road.width" type="number" step="0.5" min="0" class="w-24 cell-input" /></td>
                <td class="px-3 py-1.5">
                  <div class="flex flex-wrap items-center gap-1 max-w-xl">
                    <span v-for="(rid, i) in road.ids" :key="`${road._key}-${i}`" class="flex items-center gap-0.5">
                      <select v-model="road.ids[i]" class="w-24 cell-input">
                        <option value="">--</option>
                        <option v-for="opt in registerIds" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                      <button
                        v-if="road.ids.length > 1"
                        @click="road.ids.splice(i, 1)"
                        class="text-red-500 hover:text-red-700 text-xs leading-none"
                        title="Remove this point"
                      >✕</button>
                    </span>
                    <button @click="road.ids.push('')" class="text-xs text-blue-600 hover:underline whitespace-nowrap">+ point</button>
                  </div>
                </td>
                <td class="px-3 py-1.5">
                  <button @click="local.roads.splice(idx, 1)" class="text-red-500 hover:text-red-700 text-xs">✕</button>
                </td>
              </tr>
              <tr v-if="!local.roads.length">
                <td colspan="4" class="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No roads defined.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Actions -->
    <div class="flex justify-end pt-2">
      <button
        @click="saveAndContinue"
        :disabled="loading || !isValid"
        class="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium"
      >
        {{ loading ? "Saving..." : "Save & Continue" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import InfoTip from "~/components/InfoTip.vue";
import { parseTable } from "~/composables/useSheetParser";

export interface LayoutDesignParams {
  plot: { frontage: number; depth: number; min_area: number; remainder_strategy: string };
  roads: { major_width: number; collector_width: number; access_width: number; corner_radius: number; major_road_name: string };
  blocks: { double_loaded: boolean; max_length: number; orientation: string };
  reserves: { open_space_percent: number; commercial_along_major: boolean; facilities: string[] };
}

export interface CornerRow {
  _key: string;
  point: string;
  northing: number | null;
  easting: number | null;
}

export interface PlotRow {
  _key: string;
  block: string;
  number: number | null;
  ids: string[];
  use: string;
  area: number | null;
}

export interface RoadRow {
  _key: string;
  name: string;
  width: number | null;
  ids: string[];
}

export interface LayoutDesignData {
  mode: "generate" | "draw";
  params: LayoutDesignParams;
  corners: CornerRow[];
  plots: PlotRow[];
  roads: RoadRow[];
}

const props = defineProps<{ modelValue: LayoutDesignData }>();
const emit = defineEmits<{
  "update:model-value": [value: LayoutDesignData];
  complete: [];
}>();

const modes = [
  { value: "generate" as const, label: "Auto-generate subdivision" },
  { value: "draw" as const, label: "Enter designed layout" },
];

const route = useRoute();
const toast = useToast();
const loading = ref(false);

const local = reactive<LayoutDesignData>(JSON.parse(JSON.stringify(props.modelValue)));

const facilitiesText = computed({
  get: () => local.params.reserves.facilities.join(", "),
  set: (v: string) => {
    local.params.reserves.facilities = v
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  },
});

watch(
  () => local,
  () => emit("update:model-value", JSON.parse(JSON.stringify(local))),
  { deep: true }
);

/** All point ids available in the corner register (dropdown options). */
const registerIds = computed(() => {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const c of local.corners) {
    const id = (c.point || "").trim();
    if (id && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }
  return ids;
});

const cleanIds = (ids: string[]): string[] =>
  ids.map((v) => (v || "").trim()).filter(Boolean);

// ---------------------------------------------------------------------------
// Auto-compute plot areas from corner ids (shoelace, via the API)
// ---------------------------------------------------------------------------
const areaSignatures = new Map<string, string>(); // plot _key -> ids signature
let areaTimer: ReturnType<typeof setTimeout> | null = null;

const plotSignature = (p: PlotRow) => cleanIds(p.ids).join("|");

/** Remember current signatures without computing (used on load/import so
 * plots that already carry areas don't trigger a request storm). */
function primeAreaSignatures() {
  areaSignatures.clear();
  for (const p of local.plots) areaSignatures.set(p._key, plotSignature(p));
}
primeAreaSignatures();

async function computePlotArea(plot: PlotRow) {
  const ids = cleanIds(plot.ids);
  if (ids.length < 3) return;

  const registry = new Map(
    local.corners
      .filter((c) => c.point && c.northing != null && c.easting != null)
      .map((c) => [c.point.trim(), c])
  );
  const points = ids.map((id) => registry.get(id)).filter(Boolean) as CornerRow[];
  if (points.length !== ids.length) return; // some ids not in the register yet

  try {
    const { $axios } = useNuxtApp();
    const res = await $axios.post(`/traverse/area-computation`, {
      points: points.map((c) => ({
        id: c.point,
        northing: Number(c.northing),
        easting: Number(c.easting),
      })),
    });
    const area = res.data?.data?.area;
    if (typeof area === "number" && isFinite(area)) {
      plot.area = area;
    }
  } catch {
    // offline or invalid polygon — leave the area for manual entry
  }
}

watch(
  () => local.plots.map((p) => `${p._key}:${plotSignature(p)}`).join("§"),
  () => {
    if (areaTimer) clearTimeout(areaTimer);
    areaTimer = setTimeout(() => {
      for (const p of local.plots) {
        const sig = plotSignature(p);
        if (areaSignatures.get(p._key) !== sig) {
          areaSignatures.set(p._key, sig);
          if (cleanIds(p.ids).length >= 3) void computePlotArea(p);
        }
      }
    }, 600);
  }
);

const isValid = computed(() => {
  if (local.mode === "generate") {
    const p = local.params;
    return p.plot.frontage > 0 && p.plot.depth > 0 && p.blocks.max_length > 0;
  }
  const corners = local.corners.filter((c) => c.point && c.northing != null && c.easting != null);
  const plots = local.plots.filter((p) => cleanIds(p.ids).length >= 3);
  return corners.length >= 3 && plots.length >= 1 && plots.length === local.plots.length;
});

const cornersFileRef = ref<HTMLInputElement | null>(null);
const plotsFileRef = ref<HTMLInputElement | null>(null);
const roadsFileRef = ref<HTMLInputElement | null>(null);

function downloadCsv(name: string, lines: string[]) {
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCornersTemplate() {
  downloadCsv("layout_corners_template.csv", [
    "Point,Easting,Northing",
    "PB 101,543110.500,712440.120",
    "PB 102,543125.500,712440.050",
    "PB 103,543125.430,712410.080",
    "PB 104,543110.430,712410.150",
  ]);
}

function downloadPlotsTemplate() {
  downloadCsv("layout_plots_template.csv", [
    "Block,Number,Use,Area,Corner_IDs",
    "A,1,residential,450,PB 101; PB 102; PB 103; PB 104",
    "A,2,commercial,450,PB 102; PB 105; PB 106; PB 103",
  ]);
}

function downloadRoadsTemplate() {
  downloadCsv("layout_roads_template.csv", [
    "Name,Width,Centerline_IDs",
    "Road 1,9,RC 01; RC 02",
    "Unity Avenue,15,RC 03; RC 04; RC 05",
  ]);
}

/** ids inside one CSV cell may be separated by ';' or ',' (when quoted) */
const parseCellIds = (cell: string): string[] =>
  String(cell || "")
    .split(/[;,]/)
    .map((v) => v.trim())
    .filter(Boolean);

function stripHeader(rows: any[][], pattern: RegExp): any[][] {
  if (Array.isArray(rows[0]) && pattern.test(String(rows[0].join(" ")).toLowerCase())) {
    return rows.slice(1);
  }
  return rows;
}

async function onImport(event: Event, target: "corners" | "plots" | "roads") {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const isExcel = /\.(xls|xlsx)$/i.test(file.name);
  const reader = new FileReader();
  reader.onload = async () => {
    const rows = (await parseTable(
      isExcel ? (reader.result as ArrayBuffer) : String(reader.result || "")
    )) as any[][];

    if (target === "corners") {
      const parsed = stripHeader(rows, /point|gcp|name|east|north/)
        .map((c) => ({
          _key: crypto.randomUUID(),
          point: String(c[0] ?? "").trim(),
          easting: c[1] !== "" && c[1] !== undefined ? Number(c[1]) : null,
          northing: c[2] !== "" && c[2] !== undefined ? Number(c[2]) : null,
        }))
        .filter((r) => r.point && r.easting != null && r.northing != null);
      if (parsed.length) local.corners = parsed;
      toast.add({
        title: parsed.length ? `Imported ${parsed.length} corner points` : "No corner points found",
        color: parsed.length ? "success" : "error",
      });
    } else if (target === "plots") {
      const parsed = stripHeader(rows, /block|number|use|area|corner|ids/)
        .map((c) => ({
          _key: crypto.randomUUID(),
          block: String(c[0] ?? "").trim(),
          number: c[1] !== "" && c[1] !== undefined ? Number(c[1]) : null,
          use: String(c[2] ?? "residential").trim().toLowerCase() || "residential",
          area: c[3] !== "" && c[3] !== undefined ? Number(c[3]) : null,
          ids: parseCellIds(String(c[4] ?? "")),
        }))
        .filter((p) => p.ids.length >= 3);
      if (parsed.length) {
        local.plots = parsed;
        primeAreaSignatures();
      }
      toast.add({
        title: parsed.length ? `Imported ${parsed.length} plots` : "No plots found (each needs at least 3 corner ids)",
        color: parsed.length ? "success" : "error",
      });
    } else {
      const parsed = stripHeader(rows, /name|width|centerline|ids/)
        .map((c) => ({
          _key: crypto.randomUUID(),
          name: String(c[0] ?? "").trim(),
          width: c[1] !== "" && c[1] !== undefined ? Number(c[1]) : 9,
          ids: parseCellIds(String(c[2] ?? "")),
        }))
        .filter((r) => r.ids.length >= 2);
      if (parsed.length) local.roads = parsed;
      toast.add({
        title: parsed.length ? `Imported ${parsed.length} roads` : "No roads found (each needs at least 2 centerline ids)",
        color: parsed.length ? "success" : "error",
      });
    }
    input.value = "";
  };
  if (isExcel) reader.readAsArrayBuffer(file);
  else reader.readAsText(file);
}

function addCorner() {
  local.corners.push({ _key: crypto.randomUUID(), point: "", northing: null, easting: null });
}
function addPlot() {
  local.plots.push({ _key: crypto.randomUUID(), block: "A", number: (local.plots.length || 0) + 1, ids: [""], use: "residential", area: null });
}
function addRoad() {
  local.roads.push({ _key: crypto.randomUUID(), name: `Road ${local.roads.length + 1}`, width: 9, ids: [""] });
}

async function saveAndContinue() {
  if (!isValid.value || loading.value) return;
  const planId = route.params.plan as string;
  const { $axios } = useNuxtApp();

  try {
    loading.value = true;

    if (local.mode === "generate") {
      await $axios.put(`/plan/layout/params/edit/${planId}`, {
        plot: { ...local.params.plot },
        roads: { ...local.params.roads },
        blocks: { ...local.params.blocks },
        reserves: { ...local.params.reserves, facilities: [...local.params.reserves.facilities] },
      });
      toast.add({ title: "Layout parameters saved", color: "success" });
    } else {
      await $axios.put(`/plan/layout/data/edit/${planId}`, {
        coordinates: local.corners
          .filter((c) => c.point && c.northing != null && c.easting != null)
          .map((c) => ({ id: c.point, northing: Number(c.northing), easting: Number(c.easting) })),
        plots: local.plots.map((p) => ({
          block: p.block || "",
          number: p.number ?? "",
          ids: cleanIds(p.ids),
          area: p.area != null ? Number(p.area) : undefined,
          use: p.use || "residential",
        })),
        ...(local.roads.length
          ? {
              roads: local.roads
                .filter((r) => cleanIds(r.ids).length >= 2)
                .map((r) => ({
                  name: r.name || "",
                  width: Number(r.width ?? 9),
                  centerline_ids: cleanIds(r.ids),
                })),
            }
          : {}),
      });
      toast.add({ title: "Layout data saved", color: "success" });
    }

    emit("complete");
  } catch (error: any) {
    toast.add({
      title: "Failed to save layout design",
      description: error.response?.data?.message || "Please try again",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@reference "~/assets/css/main.css";

.field-label {
  @apply text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1;
}
.field-input {
  @apply w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.table-btn {
  @apply px-3 py-1.5 text-xs border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-slate-700;
}
.cell-input {
  @apply text-sm rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-2 py-1;
}
</style>
