<template>
  <div>
    <UserHeader />

    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back / Edit Actions -->
        <div class="mb-4 flex items-center gap-3">
          <button
            @click="navigateTo(`/project/${projectId}`)"
            class="inline-flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <RiArrowLeftLine class="w-4 h-4" /> Back to Project
          </button>
          <div class="ml-auto flex items-center gap-2">
            <button
              @click="generatePlan"
              :disabled="generationState.loading"
              class="inline-flex items-center px-3 py-2 text-sm rounded-md border border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="generationState.loading"
                class="animate-spin w-4 h-4 mr-1"
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
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {{ generationState.loading ? "Generating..." : "Download Plan" }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Plan Details
            <span
              v-if="planData.basic.name"
              class="ml-2 text-2xl font-semibold text-gray-600 dark:text-gray-300"
            >
              — {{ planData.basic.name }}
            </span>
          </h1>
          <div class="flex items-center gap-2">
            <button
              @click="navigateTo(`/project/${projectId}/plan/${planId}/edit`)"
              class="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
              title="Edit Plan"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="showDeleteModal = true"
              class="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
              title="Delete Plan"
            >
              <RiDeleteBinLine class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Skeleton -->
        <div v-if="initialLoading" class="space-y-6">
          <div
            class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 animate-pulse"
          >
            <div
              class="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"
            ></div>
            <div
              class="h-4 bg-gray-100 dark:bg-slate-700/60 rounded w-1/2 mb-2"
            ></div>
            <div
              class="h-4 bg-gray-100 dark:bg-slate-700/60 rounded w-1/3"
            ></div>
          </div>
          <div
            class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 animate-pulse"
          >
            <div
              class="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"
            ></div>
            <div class="h-40 bg-gray-100 dark:bg-slate-700/60 rounded"></div>
          </div>
          <div
            class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 animate-pulse"
          >
            <div
              class="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"
            ></div>
            <div class="h-40 bg-gray-100 dark:bg-slate-700/60 rounded"></div>
          </div>
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
          <!-- Basic Details -->
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h2
                class="text-lg font-semibold text-gray-800 dark:text-gray-100"
              >
                Basic Details
              </h2>
              <button
                @click="showEditEmbellishmentModal = true"
                class="inline-flex items-center gap-1 text-xs px-2 py-1 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                title="Edit embellishment details"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Details
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div class="text-gray-500 dark:text-gray-400">Plan Name</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.basic.name || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Type</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.basic.type || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">
                  Personnel Name
                </div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.personel_name || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">
                  Surveyor / Supervisor
                </div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.surveyor_name || "—" }}
                </div>
              </div>
            </div>
          </div>

          <!-- Coordinates -->
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div class="flex items-center mb-4">
              <h2
                class="text-lg font-semibold text-gray-800 dark:text-gray-100"
              >
                Coordinate Table
              </h2>
              <span class="ml-2 text-xs text-gray-500 dark:text-gray-400"
                >({{ planData.coordinates.length }})</span
              >
              <div class="ml-auto flex items-center gap-2">
                <button
                  @click="exportCoordinates"
                  class="text-xs px-2 py-1 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  title="Export coordinates as CSV"
                >
                  Export CSV
                </button>
                <button
                  v-if="planData.coordinates.length > 10"
                  @click="showAllCoordinates = !showAllCoordinates"
                  class="text-xs px-2 py-1 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  {{ showAllCoordinates ? "Show Less" : "Show All" }}
                </button>
              </div>
            </div>
            <div v-if="planData.coordinates.length" class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr
                    class="text-left text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700"
                  >
                    <th class="py-2 pr-4">Point ID</th>
                    <th class="py-2 pr-4">Northing(mN)</th>
                    <th class="py-2 pr-4">Easting(mE)</th>
                    <th class="py-2 pr-4">Elevation(m)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="c in visibleCoordinates"
                    :key="c._key"
                    class="border-b border-gray-100 dark:border-slate-700/60"
                  >
                    <td class="py-2 pr-4 text-gray-800 dark:text-gray-100">
                      {{ c.point || "—" }}
                    </td>
                    <td class="py-2 pr-4 text-gray-800 dark:text-gray-100">
                      {{ formatNumber(c.northing) }}
                    </td>
                    <td class="py-2 pr-4 text-gray-800 dark:text-gray-100">
                      {{ formatNumber(c.easting) }}
                    </td>
                    <td class="py-2 pr-4 text-gray-800 dark:text-gray-100">
                      {{ formatNumber(c.elevation) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">
              No coordinates added.
            </div>
          </div>

          <!-- Parcels -->
          <div
            v-if="planData.parcels.length"
            class="bg-white dark:bg-slate-800 rounded-lg shadow p-6"
          >
            <div class="flex items-center mb-4">
              <h2
                class="text-lg font-semibold text-gray-800 dark:text-gray-100"
              >
                Parcel Table
              </h2>
              <span class="ml-2 text-xs text-gray-500 dark:text-gray-400"
                >({{ planData.parcels.length }})</span
              >
            </div>
            <div v-if="planData.parcels.length" class="space-y-3">
              <div
                v-for="p in planData.parcels"
                :key="p._key"
                class="border border-gray-200 dark:border-slate-700 rounded-md p-3"
              >
                <div
                  class="text-sm font-medium text-gray-800 dark:text-gray-100"
                >
                  {{ p.name || "Unnamed parcel" }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  IDs: <span v-if="p.ids?.length">{{ p.ids.join(", ") }}</span
                  ><span v-else>—</span>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">
              No parcels added.
            </div>
          </div>

          <!-- Embellishment -->
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h2
              class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Plan Embellishment
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div class="text-gray-500 dark:text-gray-400">Name</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.name || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Title</div>
                <div
                  class="text-gray-800 dark:text-gray-100"
                  v-html="planData.embellishment.title || '—'"
                ></div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Address</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.address || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Local Govt</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.local_govt || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">State</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.state || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Plan Number</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.plan_number || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Origin</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ formatOrigin(planData.embellishment.origin) }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Scale</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.scale ?? "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Beacon Type</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.beacon_type || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">
                  Personnel Name
                </div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.personel_name || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">
                  Surveyor Name
                </div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.surveyor_name || "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Font</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{
                    `${planData.embellishment.font} (${planData.embellishment.font_size})`
                  }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Beacon Size</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.beacon_size ?? "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Label Size</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.label_size ?? "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Page Size</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.page_size ?? pageSize ?? "—" }}
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Orientation</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{
                    planData.embellishment.page_orientation ??
                    pageOrientation ??
                    "—"
                  }}
                </div>
              </div>
              <div class="md:col-span-2">
                <div class="text-gray-500 dark:text-gray-400">Footers</div>
                <div class="text-gray-800 dark:text-gray-100">
                  <div
                    v-if="planData.embellishment.footers?.length"
                    v-for="(f, i) in planData.embellishment.footers"
                    :key="i"
                    class="text-sm"
                    v-html="f"
                  ></div>
                  <div
                    v-else-if="footers.length"
                    v-for="(f, i) in footers"
                    :key="`f-${i}`"
                    class="text-sm"
                    v-html="f"
                  ></div>
                  <div v-else>—</div>
                </div>
              </div>
              <div>
                <div class="text-gray-500 dark:text-gray-400">Footer Size</div>
                <div class="text-gray-800 dark:text-gray-100">
                  {{ planData.embellishment.footer_size ?? footerSize ?? "—" }}
                </div>
              </div>
            </div>

            <!-- Topographic Settings (inside Embellishment) -->
            <div
              v-if="planData.basic.type === 'topographic'"
              class="mt-4 border-t border-gray-100 dark:border-slate-700 pt-4"
            >
              <h3
                class="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3"
              >
                Topographic Settings
              </h3>
              <div
                v-if="topographicSettings"
                class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
              >
                <div>
                  <div class="text-gray-500 dark:text-gray-400">
                    Show Spot Heights
                  </div>
                  <div class="text-gray-800 dark:text-gray-100">
                    {{ topographicSettings.show_spot_heights ? "Yes" : "No" }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500 dark:text-gray-400">
                    Point Label Scale
                  </div>
                  <div class="text-gray-800 dark:text-gray-100">
                    {{ topographicSettings.point_label_scale ?? "—" }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500 dark:text-gray-400">
                    Show Contours
                  </div>
                  <div class="text-gray-800 dark:text-gray-100">
                    {{ topographicSettings.show_contours ? "Yes" : "No" }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500 dark:text-gray-400">
                    Contour Interval
                  </div>
                  <div class="text-gray-800 dark:text-gray-100">
                    {{ topographicSettings.contour_interval ?? "—" }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500 dark:text-gray-400">
                    Major Contour
                  </div>
                  <div class="text-gray-800 dark:text-gray-100">
                    {{ topographicSettings.major_contour ?? "—" }}
                  </div>
                </div>
                <div>
                  <div class="text-gray-500 dark:text-gray-400">
                    Minimum Distance
                  </div>
                  <div class="text-gray-800 dark:text-gray-100">
                    {{ topographicSettings.minimum_distance ?? "—" }}
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400">
                No topographic settings available.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Plan Confirmation Modal -->
  <ConfirmModal
    v-model="showDeleteModal"
    title="Delete Plan"
    message="Are you sure you want to delete this plan? This action cannot be undone."
    @confirmed="confirmDelete"
  />

  <!-- Edit Embellishment Modal -->
  <EditEmbellishmentModal
    v-model="showEditEmbellishmentModal"
    :embellishment="planData.embellishment"
    :plan-id="planId"
    :all-plan-data="buildFullPlanPayload()"
    @saved="refreshPlanData"
  />
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] });

import { RiArrowLeftLine, RiDeleteBinLine } from "@remixicon/vue";
import ConfirmModal from "~/components/ConfirmModal.vue";
import EditEmbellishmentModal from "~/components/EditEmbellishmentModal.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import axios from "axios";

const route = useRoute();
const toast = useToast();

const projectId = route.params.id as string;
const planId = route.params.plan as string;
const initialLoading = ref(true);
const showDeleteModal = ref(false);
const showEditEmbellishmentModal = ref(false);
const showAllCoordinates = ref(false);

const topographicSettings = ref<any>(null);
const pageSize = ref<string | null>(null);
const pageOrientation = ref<string | null>(null);
const footers = ref<string[]>([]);
const footerSize = ref<number | null>(null);

const planData = reactive({
  basic: { name: "", type: "" },
  coordinates: [] as any[],
  parcels: [] as any[],
  drawing: { file: null as File | null, fileName: "" },
  embellishment: {
    name: "",
    font: "Arial",
    font_size: 12,
    title: "",
    address: "",
    local_govt: "",
    state: "",
    plan_number: "",
    origin: "utm_zone_31",
    scale: 1,
    beacon_type: "none",
    beacon_size: null as number | null,
    label_size: null as number | null,
    page_size: null as string | null,
    page_orientation: null as string | null,
    dxf_version: "R2018",
    footers: [] as string[],
    footer_size: null as number | null,
    personel_name: "",
    surveyor_name: "",
  },
  report: { generate: true },
});

// Plan generation state
const generationState = reactive({
  loading: false,
  url: null as string | null,
  error: null as string | null,
});

onMounted(async () => {
  try {
    const res = await axios.get(`/plan/fetch/${planId}`);
    const data = res?.data?.data;
    if (data) {
      // Basic
      planData.basic.name = data.name || "";
      planData.basic.type = data.type || "";

      // Coordinates
      if (Array.isArray(data.coordinates)) {
        planData.coordinates = data.coordinates.map((c: any) => ({
          _key: crypto.randomUUID(),
          point: c.id ?? "",
          northing: c.northing ?? null,
          easting: c.easting ?? null,
          elevation: c.elevation ?? null,
        }));
      }

      // Parcels
      if (Array.isArray(data.parcels)) {
        planData.parcels = data.parcels.map((p: any) => ({
          _key: crypto.randomUUID(),
          name: p.name ?? "",
          ids: Array.isArray(p.ids) ? [...p.ids] : [],
        }));
      }

      // Embellishment fields
      const emb: any = data;
      if (emb) {
        planData.embellishment = {
          ...planData.embellishment,
          name: emb.name ?? planData.embellishment.name,
          font: emb.font ?? planData.embellishment.font,
          font_size: emb.font_size ?? planData.embellishment.font_size,
          title: emb.title ?? planData.embellishment.title,
          address: emb.address ?? planData.embellishment.address,
          local_govt: emb.local_govt ?? planData.embellishment.local_govt,
          state: emb.state ?? planData.embellishment.state,
          plan_number: emb.plan_number ?? planData.embellishment.plan_number,
          origin: emb.origin ?? planData.embellishment.origin,
          scale: emb.scale ?? planData.embellishment.scale,
          beacon_type: emb.beacon_type ?? planData.embellishment.beacon_type,
          beacon_size: emb.beacon_size ?? planData.embellishment.beacon_size,
          label_size: emb.label_size ?? planData.embellishment.label_size,
          page_size: emb.page_size ?? planData.embellishment.page_size,
          page_orientation:
            emb.page_orientation ?? planData.embellishment.page_orientation,
          dxf_version: emb.dxf_version ?? planData.embellishment.dxf_version,
          footers: Array.isArray(emb.footers)
            ? [...emb.footers]
            : planData.embellishment.footers ?? footers.value,
          footer_size:
            emb.footer_size ??
            planData.embellishment.footer_size ??
            footerSize.value,
          personel_name:
            emb.personel_name ?? planData.embellishment.personel_name,
          surveyor_name:
            emb.surveyor_name ?? planData.embellishment.surveyor_name,
        };
      }
    }

    // Topographic settings and page/footer info may be at root of response
    if (data?.topographic_setting) {
      topographicSettings.value = data.topographic_setting;
    }
  } catch (error) {
    toast?.add?.({ title: "Failed to load plan", color: "error" });
  } finally {
    initialLoading.value = false;
  }
});

const visibleCoordinates = computed(() => {
  if (showAllCoordinates.value) return planData.coordinates;
  return planData.coordinates.slice(0, 10);
});

function exportCoordinates() {
  if (!planData.coordinates || !planData.coordinates.length) {
    toast?.add?.({ title: "No coordinates to export", color: "warning" });
    return;
  }

  const rows = planData.coordinates.map((c: any) => {
    return [
      c.point ?? "",
      c.northing ?? "",
      c.easting ?? "",
      c.elevation ?? "",
    ].join(",");
  });
  const header = ["id", "northing", "easting", "elevation"].join(",");
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `coordinates_${planData.basic.name || planId}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast?.add?.({ title: "Coordinates exported", color: "success" });
}

function formatNumber(v: number | string | null | undefined) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(
    n
  );
}

function formatOrigin(origin: string | null | undefined) {
  if (!origin) return "—";
  return origin.replace(/_/g, " ");
}

async function confirmDelete() {
  try {
    await axios.delete(`/plan/delete/${planId}`);
    toast.add({ title: "Plan deleted successfully", color: "success" });
    navigateTo(`/project/${projectId}`);
  } catch (error) {
    toast.add({ title: "Failed to delete plan", color: "error" });
  }
  showDeleteModal.value = false;
}

async function generatePlan() {
  if (generationState.loading) return;

  try {
    generationState.loading = true;
    generationState.error = null;
    generationState.url = null;

    const response = await axios.get(`/plan/generate/${planId}`);

    if (response.data?.error === false && response.data?.data?.url) {
      generationState.url = response.data.data.url;

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = response.data.data.url;
      link.download = `plan_${planData.basic.name || planId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast?.add?.({
        title: "Plan generated successfully!",
        description: "Your plan package has been downloaded.",
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

// Build complete plan payload to pass to the modal
function buildFullPlanPayload() {
  return {
    // Embellishment fields
    name: planData.embellishment.name,
    font: planData.embellishment.font,
    font_size: Number(planData.embellishment.font_size ?? 1),
    title: planData.embellishment.title,
    address: planData.embellishment.address,
    local_govt: planData.embellishment.local_govt,
    state: planData.embellishment.state,
    plan_number: planData.embellishment.plan_number,
    origin: planData.embellishment.origin,
    scale: Number(planData.embellishment.scale ?? 1),
    beacon_type: planData.embellishment.beacon_type,
    beacon_size: Number(planData.embellishment.beacon_size ?? 0.75),
    label_size: Number(planData.embellishment.label_size ?? 0.25),
    personel_name: planData.embellishment.personel_name,
    surveyor_name: planData.embellishment.surveyor_name,
    page_size: planData.embellishment.page_size ?? "A4",
    page_orientation: planData.embellishment.page_orientation ?? "portrait",
    dxf_version: planData.embellishment.dxf_version ?? "R2018",
    footers: Array.isArray(planData.embellishment.footers)
      ? planData.embellishment.footers
      : [],
    footer_size: Number(planData.embellishment.footer_size ?? 1),
  };
}

// Refresh plan data after edit
async function refreshPlanData() {
  try {
    const res = await axios.get(`/plan/fetch/${planId}`);
    const data = res?.data?.data;
    if (data) {
      // Update embellishment fields
      const emb: any = data;
      if (emb) {
        planData.embellishment = {
          ...planData.embellishment,
          name: emb.name ?? planData.embellishment.name,
          personel_name:
            emb.personel_name ?? planData.embellishment.personel_name,
          surveyor_name:
            emb.surveyor_name ?? planData.embellishment.surveyor_name,
        };
      }
    }
    toast.add({ title: "Plan details refreshed", color: "success" });
  } catch (error) {
    console.error("Failed to refresh plan data:", error);
  }
}
</script>

<style scoped></style>
