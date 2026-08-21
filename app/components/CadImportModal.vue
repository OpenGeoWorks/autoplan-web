<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="close"
  >
    <div
      class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-slate-800 shadow-xl"
    >
      <!-- Header -->
      <div
        class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4"
      >
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
            Import from CAD drawing
          </h2>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {{ inspection?.file_name }} ·
            {{ inspection?.file_format?.toUpperCase() }}
            <span v-if="inspection?.dxf_version"> · {{ inspection.dxf_version }}</span>
          </p>
        </div>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          @click="close"
        >
          ✕
        </button>
      </div>

      <div v-if="inspection" class="px-5 py-4 space-y-5">
        <!-- Warnings -->
        <div
          v-if="inspection.warnings?.length"
          class="rounded-md border border-amber-300 bg-amber-50 dark:border-amber-700/60 dark:bg-amber-900/20 px-3 py-2 space-y-1"
        >
          <p
            v-for="(warning, i) in inspection.warnings"
            :key="i"
            class="text-xs text-amber-800 dark:text-amber-200"
          >
            {{ warning }}
          </p>
        </div>

        <!-- Units: confirmed, not assumed. A drawing read in the wrong unit
             produces a plan that is wrong rather than obviously broken. -->
        <section class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            1. Confirm the drawing units
          </h3>
          <div class="flex flex-wrap items-center gap-3">
            <select
              v-model.number="units"
              class="text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2"
              @change="reinspect"
            >
              <option v-for="u in UNIT_OPTIONS" :key="u.code" :value="u.code">
                {{ u.label }}
              </option>
            </select>
            <span class="text-xs text-gray-600 dark:text-gray-400">
              The drawing says <strong>{{ inspection.units }}</strong
              >. Check the coordinate range below looks like your survey area.
            </span>
          </div>
          <div
            class="rounded-md bg-gray-50 dark:bg-slate-900/40 px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-300"
          >
            E {{ fmt(inspection.min_easting) }} → {{ fmt(inspection.max_easting) }} &nbsp;·&nbsp;
            N {{ fmt(inspection.min_northing) }} → {{ fmt(inspection.max_northing) }}
            <span class="ml-2 text-gray-500">({{ spanLabel }})</span>
          </div>
        </section>

        <!-- Boundary choice -->
        <section class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            2. Choose the boundary
          </h3>
          <p
            v-if="!inspection.rings?.length"
            class="text-sm text-gray-600 dark:text-gray-400"
          >
            No closed shape was found in this drawing.
          </p>
          <div v-else class="space-y-2">
            <label
              v-for="ring in inspection.rings"
              :key="ring.id"
              class="flex items-start gap-3 rounded-md border px-3 py-2 cursor-pointer transition"
              :class="
                selectedRingId === ring.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50'
              "
            >
              <input
                v-model="selectedRingId"
                type="radio"
                :value="ring.id"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="min-w-0 flex-1">
                <span
                  class="block text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {{ formatArea(ring.area) }}
                  <span class="font-normal text-gray-500 dark:text-gray-400">
                    · {{ ring.vertices.length }} corners</span
                  >
                </span>
                <span class="block text-xs text-gray-600 dark:text-gray-400">
                  Layer <span class="font-mono">{{ ring.layer }}</span> ·
                  {{
                    ring.source === "chained"
                      ? "rebuilt from separate lines"
                      : "closed shape"
                  }}
                  <span v-if="ring.gap_closed">
                    · closed a {{ ring.gap_closed }} m gap</span
                  >
                </span>
              </span>
              <CadRingPreview :ring="ring" class="shrink-0" />
            </label>
          </div>
        </section>

        <!-- What else is in the drawing -->
        <section class="space-y-2">
          <button
            type="button"
            class="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline"
            @click="showLayers = !showLayers"
          >
            {{ showLayers ? "Hide" : "Show" }} what else is in this drawing
            ({{ inspection.layers?.length || 0 }} layers)
          </button>
          <div v-if="showLayers" class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead class="text-gray-500 dark:text-gray-400">
                <tr class="text-left">
                  <th class="py-1 pr-3 font-medium">Layer</th>
                  <th class="py-1 pr-3 font-medium">Entities</th>
                  <th class="py-1 pr-3 font-medium">Shapes</th>
                  <th class="py-1 pr-3 font-medium">Points</th>
                  <th class="py-1 font-medium">Labels</th>
                </tr>
              </thead>
              <tbody class="text-gray-700 dark:text-gray-300">
                <tr
                  v-for="layer in inspection.layers"
                  :key="layer.name"
                  class="border-t border-gray-100 dark:border-slate-700"
                >
                  <td class="py-1 pr-3 font-mono">{{ layer.name }}</td>
                  <td class="py-1 pr-3">{{ layer.entity_count }}</td>
                  <td class="py-1 pr-3">{{ layer.ring_count || "—" }}</td>
                  <td class="py-1 pr-3">{{ layer.point_count || "—" }}</td>
                  <td class="py-1">{{ layer.label_count || "—" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- What will be imported -->
        <section v-if="selectedRing" class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            3. Coordinates to import
          </h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            {{ stationsRecovered }} Bearings, distances and area are recomputed
            from the geometry — they are never read from the drawing's text.
          </p>
          <div class="max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-slate-700">
            <table class="w-full text-xs">
              <thead
                class="sticky top-0 bg-gray-50 dark:bg-slate-900/60 text-gray-500 dark:text-gray-400"
              >
                <tr class="text-left">
                  <th class="py-1.5 px-3 font-medium">Station</th>
                  <th class="py-1.5 px-3 font-medium">Northing</th>
                  <th class="py-1.5 px-3 font-medium">Easting</th>
                </tr>
              </thead>
              <tbody class="font-mono text-gray-700 dark:text-gray-300">
                <tr
                  v-for="row in preview"
                  :key="row.id"
                  class="border-t border-gray-100 dark:border-slate-700"
                >
                  <td class="py-1 px-3">{{ row.id }}</td>
                  <td class="py-1 px-3">{{ row.northing }}</td>
                  <td class="py-1 px-3">{{ row.easting }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div v-else class="px-5 py-10 text-center text-sm text-gray-500">
        Reading drawing…
      </div>

      <!-- Footer -->
      <div
        class="sticky bottom-0 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3"
      >
        <button
          type="button"
          class="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
          @click="close"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="!selectedRing || busy"
          class="px-4 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="confirm"
        >
          {{ busy ? "Importing…" : `Import ${preview.length} coordinates` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CadRingPreview from "~/components/CadRingPreview.vue";
import type { CadInspection, CadRing, CadStation } from "~/utils/cadImport";
import { UNIT_OPTIONS, formatRingArea } from "~/utils/cadImport";

const props = defineProps<{
  open: boolean;
  inspection: CadInspection | null;
  busy?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "reinspect", units: number): void;
  (e: "confirm", coordinates: CadStation[]): void;
}>();

const selectedRingId = ref<string>("");
const showLayers = ref(false);
const units = ref<number>(6);

// Largest ring first, so the parcel is preselected and the common case is a
// single click.
watch(
  () => props.inspection,
  (value) => {
    if (!value) return;
    units.value = value.units_code || 6;
    selectedRingId.value = value.rings?.[0]?.id ?? "";
  },
  { immediate: true }
);

const selectedRing = computed<CadRing | null>(
  () => props.inspection?.rings?.find((r) => r.id === selectedRingId.value) ?? null
);

// The register is computed by the engine, not rebuilt here: station names,
// ordering and de-duplication are import rules, and one implementation of them
// is enough.
const preview = computed<CadStation[]>(() => selectedRing.value?.coordinates ?? []);

const stationsRecovered = computed(() => {
  const recovered = preview.value.filter((row) => !row.generated).length;
  if (!recovered) return "No station names were found on the drawing, so corners are numbered PB1 onwards.";
  if (recovered === preview.value.length)
    return "All station names were recovered from the drawing.";
  return `${recovered} of ${preview.value.length} station names were recovered from the drawing; the rest are numbered.`;
});

const spanLabel = computed(() => {
  const i = props.inspection;
  if (!i || i.min_easting == null) return "";
  const w = (i.max_easting ?? 0) - (i.min_easting ?? 0);
  const h = (i.max_northing ?? 0) - (i.min_northing ?? 0);
  return `${w.toFixed(1)} m × ${h.toFixed(1)} m`;
});

const fmt = (value?: number | null) =>
  value == null ? "—" : value.toFixed(3);

const formatArea = formatRingArea;

function reinspect() {
  emit("reinspect", units.value);
}

function confirm() {
  if (!selectedRing.value) return;
  emit("confirm", preview.value);
}

function close() {
  emit("close");
}
</script>
