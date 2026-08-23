<template>
  <div class="space-y-6">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
      Report
    </h2>
    <div class="space-y-4">
      <!-- Plan Summary Section -->
      <div
        class="border border-gray-200 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-800"
      >
        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Plan Summary
        </h3>

        <!-- Basic Details -->
        <div class="mb-4">
          <h4
            class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2"
          >
            Basic Details
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Name:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                basic.name || "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Type:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                basic.type || "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Coordinates:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                coordinatesCount
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Parcels:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                parcelsCount
              }}</span>
            </div>
          </div>
        </div>

        <!-- Embellishment Details -->
        <div class="mb-4">
          <h4
            class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2"
          >
            Plan Embellishment
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Plan Name:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.name || "—"
              }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 dark:text-gray-400">Title:</span>
              <span
                class="ml-2 text-gray-800 dark:text-gray-100"
                v-html="modelValue.embellishment?.title || '—'"
              ></span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Address:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.address || "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Local Govt:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.local_govt || "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">State:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.state || "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Plan Number:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.plan_number || "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Origin:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                formatOrigin(modelValue.embellishment?.origin)
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Scale:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                formatScale(modelValue.embellishment?.scale)
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Beacon Type:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                formatBeaconType(modelValue.embellishment?.beacon_type)
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Beacon Size:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.beacon_size ?? "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Label Size:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.label_size ?? "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Page Size:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.page_size ?? "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400"
                >Page Orientation:</span
              >
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.page_orientation ?? "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Font:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100"
                >{{ modelValue.embellishment?.font || "—" }} ({{
                  modelValue.embellishment?.font_size || "—"
                }}pt)</span
              >
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400"
                >Personnel Name:</span
              >
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.personel_name || "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400"
                >Surveyor Name:</span
              >
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.surveyor_name || "—"
              }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Footers:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">
                <span
                  v-if="
                    Array.isArray(modelValue.embellishment?.footers) &&
                    modelValue.embellishment?.footers.length
                  "
                >
                  <span
                    v-for="(footer, idx) in modelValue.embellishment.footers"
                    :key="idx"
                  >
                    <span v-html="footer"></span>
                  </span>
                </span>
                <span v-else>—</span>
              </span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Footer Size:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{
                modelValue.embellishment?.footer_size ?? "—"
              }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Topographic Settings & Boundary (topo plans) -->
      <div v-if="props.basic?.type === 'topographic'" class="border border-gray-200 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-800">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Topographic Summary</h3>

        <div class="mb-4">
          <h4 class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Topographic Settings</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Show spot heights:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatBool(props.topoSettings?.show_spot_heights) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Point label scale:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.topoSettings?.point_label_scale ?? '—' }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Show contours:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatBool(props.topoSettings?.show_contours) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Contour interval:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.topoSettings?.contour_interval ?? '—' }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Major contour:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.topoSettings?.major_contour ?? '—' }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Minimum distance:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.topoSettings?.minimum_distance ?? '—' }}</span>
            </div>
            <!-- <div>
              <span class="text-gray-500 dark:text-gray-400">Grid:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatBool(props.topoSettings?.grid) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">TIN:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatBool(props.topoSettings?.tin) }}</span>
            </div> -->
            <div>
              <span class="text-gray-500 dark:text-gray-400">Show contour labels:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatBool(props.topoSettings?.show_contours_labels) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Show TIN mesh:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatBool(props.topoSettings?.show_tin_mesh) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Show coordinate grid:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatBool(props.topoSettings?.show_grid) }}</span>
            </div>
          </div>
        </div>

        <!-- <div v-if="Array.isArray(props.topoBoundary)" class="mb-2">
          <h4 class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Boundary</h4>
          <div class="text-sm text-gray-800 dark:text-gray-100">
            <div>Points: {{ props.topoBoundary.length }}</div>
            <div class="mt-2">Sample points:</div>
            <ul class="list-disc ml-5 mt-1">
              <li v-for="(p, idx) in props.topoBoundary.slice(0,5)" :key="idx">{{ p.id || p.point || ('#' + (idx+1)) }} — N: {{ p.northing }} E: {{ p.easting }} Z: {{ p.elevation }}</li>
            </ul>
          </div>
        </div> -->
      </div>

      <!-- Longitudinal Profile Parameters (route plans) -->
      <div v-if="props.basic?.type === 'route' && props.longitudinalParams" class="border border-gray-200 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-800">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Longitudinal Profile Parameters</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">Horizontal Scale:</span>
            <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.longitudinalParams?.horizontal_scale ?? '—' }}</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Vertical Scale:</span>
            <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.longitudinalParams?.vertical_scale ?? '—' }}</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Station Interval:</span>
            <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.longitudinalParams?.station_interval ?? '—' }} m</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Elevation Interval:</span>
            <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.longitudinalParams?.elevation_interval ?? '—' }} m</span>
          </div>
        </div>
      </div>

      <!-- Layout Design (layout plans) -->
      <div v-if="props.basic?.type === 'layout' && props.layoutParams" class="border border-gray-200 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-800">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Layout Design</h3>

        <template v-if="props.layoutParams?.mode === 'draw'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Mode:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">Designed layout (drawn as entered)</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Plots:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.layoutParams?.plots?.length ?? 0 }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Roads:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.layoutParams?.roads?.length ?? 0 }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Mode:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">Auto-generated subdivision</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Plot Module:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.layoutParams?.params?.plot?.frontage ?? '—' }} m × {{ props.layoutParams?.params?.plot?.depth ?? '—' }} m</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Roads (major/collector/access):</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.layoutParams?.params?.roads?.major_width ?? '—' }} / {{ props.layoutParams?.params?.roads?.collector_width ?? '—' }} / {{ props.layoutParams?.params?.roads?.access_width ?? '—' }} m</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Max Block Length:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.layoutParams?.params?.blocks?.max_length ?? '—' }} m</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Open Space:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ props.layoutParams?.params?.reserves?.open_space_percent ?? '—' }}%</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Facilities:</span>
              <span class="ml-2 text-gray-800 dark:text-gray-100">{{ (props.layoutParams?.params?.reserves?.facilities || []).join(', ') || 'None' }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- Plan Generation Section -->
      <div
        class="border border-gray-300 dark:border-slate-600 rounded-md p-4 bg-gray-50 dark:bg-slate-700/50"
      >
        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Generate Plan
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 mb-4">
          Generate a complete survey plan with all the data you've entered.
        </p>

        <!--
          A plan drawn earlier. Shown before anything is generated in this
          session, so returning to a finished plan offers the file rather than
          only the button that would redraw it.
        -->
        <div
          v-if="!generationState.url && props.generated?.url"
          class="mb-4 rounded-md border border-gray-200 dark:border-slate-700 p-3"
        >
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
            A plan was generated for this record{{ generatedWhen }}.
          </p>
          <a
            :href="props.generated.url"
            download
            class="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-gray-800 text-white hover:bg-gray-900 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download the last plan
          </a>
          <p class="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            Generating again redraws it from the current data.
          </p>
        </div>

        <div v-if="generationState.url" class="mb-4">
          <div
            class="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            Plan generated and downloaded successfully!
          </div>
          <!-- The browser may have blocked the automatic download, and the
               file is worth a second chance without redrawing it. -->
          <a
            :href="generationState.url"
            download
            class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-gray-800 text-white hover:bg-gray-900 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download again
          </a>
        </div>

        <div v-else>
          <button
            @click="generatePlan"
            :disabled="generationState.loading"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="generationState.loading"
              class="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {{ generationState.loading ? "Generating..." : "Generate Plan" }}
          </button>
        </div>

        <!-- Background jobs report real stages and row counts, so a long
             generation shows what it is doing rather than a bare spinner. -->
        <div
          v-if="generationState.loading && generationState.progress.background"
          class="mt-3"
        >
          <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>{{ describeProgress(generationState.progress) }}</span>
            <span>{{ generationState.progress.percent }}%</span>
          </div>
          <div class="h-1.5 w-full rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
            <div
              class="h-full rounded-full bg-blue-600 transition-all duration-500"
              :style="{ width: generationState.progress.percent + '%' }"
            />
          </div>
        </div>

        <div
          v-if="generationState.error"
          class="mt-3 text-sm text-red-600 dark:text-red-400"
        >
          {{ generationState.error }}
        </div>
      </div>
    </div>
    <div class="flex justify-between pt-2">
      <button
        @click="$emit('cancel')"
        type="button"
        class="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        Cancel
      </button>
      <button
        @click="$emit('finish')"
        type="button"
        class="px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
      >
        Finish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import {
  generatePlan as runGeneration,
  emptyProgress,
  describeProgress,
} from "~/composables/usePlanGeneration";
import { formatPlanOrigin } from "~/utils/planOrigins";

interface Basic {
  name: string;
  type: string;
}
interface Embellishment {
  notes?: string;
  [key: string]: any;
}
interface Report {
  generate: boolean;
}

const props = defineProps<{
  modelValue: { report: Report; embellishment: Embellishment };
  basic: Basic;
  coordinatesCount: number;
  parcelsCount: number;
  // Topographic-specific (optional)
  topoSettings?: Record<string, any> | null;
  topoBoundary?: Array<Record<string, any>> | null;
  // Route-specific (optional)
  longitudinalParams?: Record<string, any> | null;
  // Layout-specific (optional)
  layoutParams?: Record<string, any> | null;
  /**
   * The last plan drawn for this record, if there is one.
   *
   * Generation takes minutes on a large survey, so a plan already drawn is
   * worth offering rather than making someone draw it again to get the file.
   */
  generated?: { url?: string; generated_at?: string; scale?: number } | null;
}>();
const emit = defineEmits(["cancel", "finish"]);

const route = useRoute();
const toast = useToast();
const planId = route.params.plan as string;

const local = reactive({
  report: { generate: true },
  embellishment: { notes: "" },
});

// Plan generation state
/** "on 23 Aug 2026", or nothing if the plan does not say when. */
const generatedWhen = computed(() => {
  const at = props.generated?.generated_at;
  if (!at) return "";
  const when = new Date(at);
  return Number.isNaN(when.getTime())
    ? ""
    : ` on ${when.toLocaleDateString(undefined, {
        day: "numeric", month: "short", year: "numeric",
      })}`;
});

const generationState = reactive({
  loading: false,
  url: null as string | null,
  error: null as string | null,
  progress: emptyProgress(),
});

// Sync from parent once on mount and whenever the reference changes (avoid deep echo loops)
watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      local.report = { ...v.report };
      local.embellishment = {
        ...(v.embellishment || {}),
        notes: v.embellishment?.notes ?? "",
      };
    }
  },
  { immediate: true }
);

async function generatePlan() {
  if (generationState.loading) return;

  try {
    generationState.loading = true;
    generationState.error = null;
    generationState.url = null;

    // A large survey is generated as a background job; this follows it and
    // reports progress, and returns the URL either way.
    const url = await runGeneration(planId, (progress) => {
      generationState.progress = progress;
    });

    if (url) {
      generationState.url = url;
      
      // Automatically trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = ''; // Browser will use filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast?.add?.({
        title: "Plan generated successfully!",
        description: "Your plan download has started.",
        color: "success",
      });
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error: any) {
    console.error("Plan generation error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to generate plan";
    generationState.error = errorMessage;
    toast?.add?.({
      title: "Generation failed",
      description: errorMessage,
      color: "error",
    });
  } finally {
    generationState.loading = false;
  }
}

// Formatting helper functions
function formatOrigin(origin: string | null | undefined) {
  return formatPlanOrigin(origin);
}

function formatScale(scale: number | null | undefined) {
  if (!scale || scale === 0) return "—";
  return `1:${scale}`;
}

function formatBeaconType(beaconType: string | null | undefined) {
  if (!beaconType || beaconType === "none") return "—";
  return beaconType.replace(/_/g, " ").toUpperCase();
}

function formatBool(v: boolean | null | undefined) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}
</script>
