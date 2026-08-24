<template>
  <div class="space-y-6">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
      Plan Embellishment
    </h2>

    <!-- Project's Information -->
    <!-- <div
      class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
    >
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Project's Information
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >File / Template Name</label
          >
          <input
            v-model="local.embellishment.name"
            type="text"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Auto Plan"
          />
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Personnel Name</label
          >
          <input
            v-model="local.embellishment.personel_name"
            type="text"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Surveyor / Supervisor</label
          >
          <input
            v-model="local.embellishment.surveyor_name"
            type="text"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Surveyor Alabi"
          />
        </div>
      </div>
    </div> -->

    <!-- Parcel's Information -->
    <div
      class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
    >
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Parcel's Information
      </h3>
      <!-- Title field - Full width -->
      <div class="space-y-4">
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Title</label
          >
          <ClientOnly>
            <QuillEditorClient
              v-model="local.embellishment.title"
              placeholder="Survey Plan Title"
            />
            <template #fallback>
              <div
                class="w-full h-[140px] rounded-md border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 flex items-center justify-center"
              >
                <span class="text-gray-500 dark:text-gray-400 text-sm"
                  >Loading editor...</span
                >
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
      <!-- Other fields in grid layout -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Address</label
          >
          <input
            v-model="local.embellishment.address"
            type="text"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Street, City"
          />
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Local Govt</label
          >
          <input
            v-model="local.embellishment.local_govt"
            type="text"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="LGA"
          />
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >State</label
          >
          <select
            v-model="local.embellishment.state"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select state</option>
            <!-- Keep a previously saved value that isn't in the list selectable -->
            <option v-if="hasCustomState" :value="local.embellishment.state">
              {{ local.embellishment.state }}
            </option>
            <option v-for="state in NIGERIA_STATES" :key="state" :value="state">
              {{ state }}
            </option>
          </select>
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Plan Number
            <InfoTip text="Official plan registration number issued for the survey (e.g. LS/D/2026/0142). Printed on the plan face." /></label
          >
          <input
            v-model="local.embellishment.plan_number"
            type="text"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PLN12345"
          />
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Origin
            <InfoTip text="Coordinate system the survey is referenced to. All Lagos-area plans use UTM Zone 31." /></label
          >
          <select
            v-model="local.embellishment.origin"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option
              v-for="option in PLAN_ORIGINS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Formatting & Symbols -->
    <div
      class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
    >
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Text & Symbols
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Font</label
          >
          <select
            v-model="local.embellishment.font"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Title Size
            <InfoTip text="Printed height of the plan title, in millimetres on the sheet. Moves the title block only — the area, origin and scale bar follow it, and the rest of the plan is unaffected. The whole block is one size. Default 3.5 mm." /></label
          >
          <input
            v-model.number="local.embellishment.font_size"
            type="number"
            step="0.5"
            min="2"
            max="14"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Scale
            <InfoTip text="Plan scale — 1:1000 means 1 cm on paper is 10 m on the ground. Larger denominators fit bigger sites on the page with less detail." /></label
          >
          <select
            name="scale"
            id="scale"
            v-model="local.embellishment.scale"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <!-- A plan saved at a scale outside the list keeps it selectable. -->
            <option v-if="hasCustomScale" :value="local.embellishment.scale">
              1:{{ Number(local.embellishment.scale).toLocaleString() }}
            </option>
            <option v-for="s in PLAN_SCALES" :key="s" :value="s">
              1:{{ s.toLocaleString() }}
            </option>
          </select>
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Beacon Size
            <InfoTip text="Printed width of the beacon symbols drawn at survey pillars, in millimetres on the sheet. Symbols only — beacon names are set by Label Size. Default 1.6 mm." /></label
          >
          <input
            v-model.number="local.embellishment.beacon_size"
            type="number"
            step="0.1"
            min="0.5"
            max="8"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Label Size
            <InfoTip text="Printed height of the annotation on the map itself — beacon names, bearings and distances, quoted coordinates, spot heights and schedule text — in millimetres on the sheet. The surveyor's defaults are already legible at every scale, so this rarely needs changing. Default 2.5 mm." /></label
          >
          <input
            v-model.number="local.embellishment.label_size"
            type="number"
            step="0.5"
            min="2"
            max="14"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="sm:col-span-2 lg:col-span-5">
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Beacon Type
            <InfoTip text="Symbol used for survey pillars on the plan. Box (hatched square) is the common convention for concrete beacons." /></label
          >
          <div class="flex flex-wrap gap-3">
            <label
              class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                class="accent-blue-600"
                value="none"
                v-model="local.embellishment.beacon_type"
              />
              <span>None</span>
            </label>
            <label
              class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                class="accent-blue-600"
                value="dot"
                v-model="local.embellishment.beacon_type"
              />
              <SvgsDot class="w-15 h-15" />
            </label>
            <label
              class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                class="accent-blue-600"
                value="circle"
                v-model="local.embellishment.beacon_type"
              />
              <SvgsCircle class="w-15 h-15" />
            </label>
            <label
              class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                class="accent-blue-600"
                value="box"
                v-model="local.embellishment.beacon_type"
              />
              <SvgsBox class="w-15 h-15" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Settings -->
    <div
      class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
    >
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Page Settings
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Page Size</label
          >
          <select
            v-model="local.embellishment.page_size"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="A2">A2</option>
            <option value="A1">A1</option>
            <option value="A0">A0</option>
          </select>
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Page Orientation</label
          >
          <select
            v-model="local.embellishment.page_orientation"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >DXF Version
            <InfoTip text="AutoCAD file format version for the DXF/DWG output. Use an older version if your CAD software can't open newer files — R2000 is widely compatible." /></label
          >
          <select
            v-model="local.embellishment.dxf_version"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="R12">AutoCAD R12 (1992)</option>
            <option value="R2000">AutoCAD 2000/2000i/2002</option>
            <option value="R2004">AutoCAD 2004/2005/2006</option>
            <option value="R2007">AutoCAD 2007/2008/2009</option>
            <option value="R2010">AutoCAD 2010/2011/2012</option>
            <option value="R2013">AutoCAD 2013-2017</option>
            <option value="R2018">AutoCAD 2018-2023</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Plan Tables -->
    <div
      v-if="supportsTables"
      class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
    >
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Plan Tables
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 -mt-2">
        Print schedules on the sheet so the drawing is self-contained for
        submission. They are placed down the right-hand side of the sheet and
        the drawing is sized to leave room for them.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label
          class="flex items-start gap-3 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 cursor-pointer"
        >
          <input
            v-model="local.embellishment.show_bearing_distance_table"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>
            <span
              class="block text-sm font-medium text-gray-900 dark:text-gray-100"
              >Bearing &amp; distance table</span
            >
            <span class="block text-xs text-gray-500 dark:text-gray-400">{{
              bearingTableHint
            }}</span>
          </span>
        </label>
        <label
          class="flex items-start gap-3 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 cursor-pointer"
        >
          <input
            v-model="local.embellishment.show_coordinate_table"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>
            <span
              class="block text-sm font-medium text-gray-900 dark:text-gray-100"
              >Coordinate table</span
            >
            <span class="block text-xs text-gray-500 dark:text-gray-400">{{
              coordinateTableHint
            }}</span>
          </span>
        </label>
      </div>
    </div>

    <!-- Footers -->
    <div
      class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4"
    >
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Footers
      </h3>
      <div class="space-y-4">
        <div
          v-for="(footer, index) in safeFooters"
          :key="index"
          class="relative"
        >
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >Footer {{ index + 1 }}</label
          >
          <div class="relative">
            <ClientOnly>
              <QuillEditorClient
                :model-value="footer || ''"
                @update:model-value="updateFooter(index, $event)"
                :placeholder="`Enter footer ${index + 1}...`"
              />
              <template #fallback>
                <div
                  class="w-full h-[100px] rounded-md border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 flex items-center justify-center"
                >
                  <span class="text-gray-500 dark:text-gray-400 text-sm"
                    >Loading editor...</span
                  >
                </div>
              </template>
            </ClientOnly>
            <button
              v-if="safeFooters.length > 1"
              @click="removeFooter(index)"
              type="button"
              class="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10"
            >
              ×
            </button>
          </div>
        </div>
        <button
          @click="addFooter"
          type="button"
          class="w-full py-2 px-4 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add Footer
        </button>
      </div>
      <div class="mt-4">
        <label
          class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
          >Footer Size
          <InfoTip text="Printed height of the footer text — certificates, property description, plan number and surveyor's name — in millimetres on the sheet. Default 2.5 mm." /></label
        >
        <input
          v-model.number="local.embellishment.footer_size"
          type="number"
          step="0.5"
          min="2"
          max="14"
          class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex justify-end pt-2">
      <button
        @click="onComplete"
        type="button"
        :disabled="loading"
        class="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium"
      >
        <span v-if="!loading">Save & Continue</span>
        <span v-else>Saving...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoTip from "~/components/InfoTip.vue";
import { NIGERIA_STATES } from "~/utils/nigeriaStates";
import { PLAN_ORIGINS } from "~/utils/planOrigins";
import { reactive, watch, computed, onMounted } from "vue";

interface EmbellishmentState {
  name: string;
  font: string;
  font_size: number;
  title: string;
  address: string;
  local_govt: string;
  state: string;
  plan_number: string;
  origin: string;
  scale: number;
  beacon_type: string;
  beacon_size: number;
  label_size: number;
  personel_name: string;
  surveyor_name: string;
  page_size: string;
  page_orientation: string;
  dxf_version: string;
  footers: string[];
  footer_size: number;
  show_bearing_distance_table: boolean;
  show_coordinate_table: boolean;
}

const props = defineProps<{
  modelValue: { embellishment: EmbellishmentState };
  loading?: boolean;
  planType?: string;
}>();
const emit = defineEmits(["update:modelValue", "complete", "refresh"]);

/**
 * The four size controls are printed millimetres on the sheet, and each one
 * governs a single group: Title Size the title block, Label Size the map
 * annotation, Footer Size the footer text, Beacon Size the symbols. These
 * defaults are the drawing engine's designed sizes, so the form shows what
 * the plan will actually be drawn at.
 */
const DEFAULT_SIZES = {
  font_size: 3.5,
  label_size: 2.5,
  footer_size: 2.5,
  beacon_size: 1.6,
} as const;

/**
 * These fields used to hold ground metres (label_size 0.25, beacon_size 0.18)
 * and the API also wrote extent-derived fractions into them. Anything that
 * small is not a printed size, and the engine reads it as "unset" — so show
 * the default the plan is really drawn at rather than a stale number the user
 * cannot make sense of.
 */
const LEGACY_TEXT_MM = 2;
const LEGACY_BEACON_MM = 0.5;

const printedSize = (
  value: unknown,
  fallback: number,
  floor: number
): number => {
  const size = Number(value);
  return Number.isFinite(size) && size >= floor ? size : fallback;
};

const local = reactive<{ embellishment: EmbellishmentState }>({
  embellishment: {
    name: "",
    font: "Arial",
    font_size: DEFAULT_SIZES.font_size,
    title: "",
    address: "",
    local_govt: "",
    state: "",
    plan_number: "",
    origin: "utm_zone_31",
    scale: 1,
    beacon_type: "none",
    beacon_size: DEFAULT_SIZES.beacon_size,
    label_size: DEFAULT_SIZES.label_size,
    personel_name: "",
    surveyor_name: "",
    page_size: "A4",
    page_orientation: "portrait",
    dxf_version: "R2018",
    footers: [""],
    footer_size: DEFAULT_SIZES.footer_size,
    show_bearing_distance_table: false,
    show_coordinate_table: false,
  },
});

// Route sheets are longitudinal profiles, not maps: they carry no parcel or
// boundary schedule, so the option is hidden rather than shown doing nothing.
const supportsTables = computed(() =>
  ["cadastral", "topographic", "layout"].includes(props.planType ?? "cadastral")
);

const bearingTableHint = computed(() =>
  props.planType === "cadastral"
    ? "Every parcel leg, with its bearing and distance."
    : "Every boundary leg, with its bearing and distance."
);

const coordinateTableHint = computed(() => {
  if (props.planType === "layout")
    return "Site boundary corners and the plot-corner register.";
  if (props.planType === "topographic") return "The boundary beacon register.";
  return "The beacon coordinate register.";
});

watch(
  () => props.modelValue,
  (v) => {
    if (v?.embellishment) {
      const saved = v.embellishment;
      local.embellishment = {
        ...local.embellishment,
        ...saved,
        footers: saved.footers?.length ? saved.footers : [""],
        font_size: printedSize(
          saved.font_size,
          DEFAULT_SIZES.font_size,
          LEGACY_TEXT_MM
        ),
        label_size: printedSize(
          saved.label_size,
          DEFAULT_SIZES.label_size,
          LEGACY_TEXT_MM
        ),
        footer_size: printedSize(
          saved.footer_size,
          DEFAULT_SIZES.footer_size,
          LEGACY_TEXT_MM
        ),
        beacon_size: printedSize(
          saved.beacon_size,
          DEFAULT_SIZES.beacon_size,
          LEGACY_BEACON_MM
        ),
      };
    }
  },
  { immediate: true, deep: true }
);

const loading = computed(() => !!props.loading);

/**
 * Scales the drawing engine knows.
 *
 * Its own ladder (`STANDARD_SCALES`) in full, which is also what it falls back
 * along when a survey will not fit the sheet at the scale requested. Offering
 * anything outside it means the plan may be drawn at a scale that was never on
 * the menu -- 1:1500 was on this list and is not on that ladder.
 *
 * 1:50000 puts 8.5 km across an A4 sheet, which is a map rather than a survey
 * plan, but it is what the engine falls back to for a site that large and
 * there is no sense in the fallback existing where it cannot be chosen.
 */
const PLAN_SCALES = [
  100, 200, 250, 500, 1000, 1250, 2000, 2500, 5000, 10000, 20000, 50000,
] as const;

// A plan saved at 1:1500, or at any scale since dropped from the list, keeps
// its value rather than silently reading as blank.
const hasCustomScale = computed(() => {
  const scale = Number(local.embellishment.scale);
  return (
    Number.isFinite(scale) &&
    scale > 0 &&
    !(PLAN_SCALES as readonly number[]).includes(scale)
  );
});

// A plan saved before the dropdown existed may hold a state name we don't list.
const hasCustomState = computed(() => {
  const state = local.embellishment.state;
  return !!state && !NIGERIA_STATES.includes(state as any);
});

onMounted(() => {
  emit("refresh");
});

// Ensure footers are always properly initialized
const safeFooters = computed(() => {
  return local.embellishment.footers.length > 0
    ? local.embellishment.footers
    : [""];
});

function addFooter() {
  local.embellishment.footers.push("");
}

function removeFooter(index: number) {
  local.embellishment.footers.splice(index, 1);
}

function updateFooter(index: number, value: string) {
  local.embellishment.footers[index] = value;
}

function onComplete() {
  emit("update:modelValue", { embellishment: { ...local.embellishment } });
  emit("complete");
}
</script>
