<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Back Computation</h2>
      <div v-if="props.planType !== 'route'">
        <label class="text-sm mr-2">Parcel:</label>
        <select v-model="selectedIndex" class="border rounded px-2 py-1">
          <option
            v-for="(p, idx) in parcelsWithIndex"
            :key="p._key"
            :value="idx"
          >
            {{ p.name || `Parcel ${idx + 1}` }}
          </option>
        </select>
      </div>
      <div v-else class="text-sm text-gray-600">Route Survey Computation</div>
    </div>

    <div v-if="loadingLocal" class="animate-pulse space-y-3">
      <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      <div class="h-8 bg-gray-200 rounded w-full"></div>
      <div class="h-8 bg-gray-200 rounded w-full"></div>
    </div>

    <div v-else>
      <div v-if="error" class="text-red-600">Failed to load computations.</div>

      <div v-if="traverse">
        <div class="mb-2 flex justify-end">
          <CoordinatePrecisionSelector v-model="coordinatePrecision" />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="text-left border-b">
                <th class="px-2 py-1">Distance (m)</th>
                <th class="px-2 py-1">Bearing</th>
                <th class="px-2 py-1">Departure</th>
                <th class="px-2 py-1">Latitude</th>
                <th class="px-2 py-1">Easting (mE)</th>
                <th class="px-2 py-1">Northing (mN)</th>
                <th class="px-2 py-1">ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="px-2 py-1"></td>
                <td class="px-2 py-1"></td>
                <td class="px-2 py-1"></td>
                <td class="px-2 py-1"></td>
                <td class="px-2 py-1">{{ formatCoordinateValue(legs[0].from.easting) }}</td>
                <td class="px-2 py-1">{{ formatCoordinateValue(legs[0].from.northing) }}</td>
                <td class="px-2 py-1">{{ legs[0].from.id }}</td>
              </tr>
              <tr v-for="(leg, i) in legs" :key="i" class="border-t">
                <td class="px-2 py-1">{{ leg.distance }}</td>
                <td class="px-2 py-1">
                  {{ formatBearing(leg.bearing?.decimal) }}
                </td>
                <td class="px-2 py-1">{{ leg.delta_easting }}</td>
                <td class="px-2 py-1">{{ leg.delta_northing }}</td>
                <td class="px-2 py-1">{{ formatCoordinateValue(leg.to.easting) }}</td>
                <td class="px-2 py-1">{{ formatCoordinateValue(leg.to.northing) }}</td>
                <td class="px-2 py-1">{{ leg.to.id }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3">
          <div>
            <strong>Total distance:</strong> {{ traverse.total_distance }} m
          </div>
          <div v-if="traverse.area && !isRouteType" class="mt-1">
            <strong>Area:</strong> {{ formatArea(traverse.area) }}
          </div>
          <div class="mt-3">
            <strong>Bounding Box:</strong>
          </div>
          <div class="mt-1 ml-4">
            <span class="mr-4"
              ><strong>Min Northing:</strong>
              {{ formatCoordinateValue(traverse.bounding_box?.min_northing) }}</span
            >
            <span class="mr-4"
              ><strong>Max Northing:</strong>
              {{ formatCoordinateValue(traverse.bounding_box?.max_northing) }}</span
            >
            <br />
            <span class="mr-4"
              ><strong>Min Easting:</strong>
              {{ formatCoordinateValue(traverse.bounding_box?.min_easting) }}</span
            >
            <span
              ><strong>Max Easting:</strong>
              {{ formatCoordinateValue(traverse.bounding_box?.max_easting) }}</span
            >
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          @click="emitComplete"
        >
          Continue to Drawing
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import { useCoordinatePrecision } from "~/composables/useCoordinatePrecision";
const emit = defineEmits(["complete"]);

const { coordinatePrecision, formatCoordinateValue } = useCoordinatePrecision();

function emitComplete() {
  emit("complete", { legs: legs.value, traverse: traverse.value });
}

import axios from "axios";

const props = defineProps({
  parcels: { type: Array as () => any[], required: true },
  coordinates: { type: Array as () => any[], required: true },
  planType: { type: String, default: "cadastral" }, // Add plan type prop
});

const selectedIndex = ref(0);
const loadingLocal = ref(false);
const error = ref(false);
const legs = ref<any[]>([]);
const traverse = ref<any | null>(null);

const parcelsWithIndex = computed(() => props.parcels || []);

// Computed property to determine if we should use coordinates directly (for route surveys)
const isRouteType = computed(() => props.planType === "route");

function buildPayloadForParcel(parcel: any) {
  // For route surveys, use coordinates directly
  if (isRouteType.value) {
    return {
      points: props.coordinates.map((c: any) => ({
        id: c.point,
        northing: Number(c.northing),
        easting: Number(c.easting),
      })),
    };
  }

  // Find points by ids in parcel.ids and map to {id, northing, easting}
  const ids = Array.isArray(parcel.ids) ? parcel.ids.filter(Boolean) : [];
  const points = ids
    .map((pid: string) => {
      const c = props.coordinates.find((cc: any) => cc.point === pid);
      if (c)
        return {
          id: pid,
          northing: Number(c.northing),
          easting: Number(c.easting),
        };
      return null;
    })
    .filter(Boolean);

  // If parcel has no ids, try to use all coordinates
  if (!points.length) {
    return {
      points: props.coordinates.map((c: any) => ({
        id: c.point,
        northing: Number(c.northing),
        easting: Number(c.easting),
      })),
    };
  }

  // Ensure closed polygon: repeat first point at end (only for cadastral surveys)
  if (points.length && points[0].id !== points[points.length - 1].id) {
    points.push({ ...points[0] });
  }

  return { points };
}

function formatBearing(decimalDeg: number | null | undefined) {
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

  // Handle rare precision edge where secondsFloat rounds to 60.0
  if (secondsFloat >= 59.9999999999) {
    secondsFloat = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    deg += 1;
  }

  // Format seconds with up to 6 decimal places, trim trailing zeros and optional trailing dot
  let secondsStr = secondsFloat.toFixed(6).replace(/\.?(0+)$/, "");
  return `${sign}${deg}° ${minutes}' ${secondsStr}\"`;
}

function formatArea(area: number | null | undefined) {
  if (area === null || area === undefined || Number.isNaN(area)) return "";

  if (area >= 10000) {
    const hectares = area / 10000;
    return `${area.toFixed(3)} sqm (${hectares.toFixed(3)} hectares)`;
  }

  return `${area.toFixed(3)} sqm`;
}

async function fetchComputation() {
  error.value = false;
  legs.value = [];
  traverse.value = null;

  let payload;
  if (isRouteType.value) {
    // For route surveys, use coordinates directly
    payload = buildPayloadForParcel(null);
  } else {
    // For cadastral surveys, use selected parcel
    const parcel = parcelsWithIndex.value[selectedIndex.value] || { ids: [] };
    payload = buildPayloadForParcel(parcel);
  }

  if (!payload.points || !payload.points.length) {
    error.value = true;
    return;
  }

  try {
    loadingLocal.value = true;
    const res = await axios.post("/traverse/back-computation", payload);
    const data = res?.data?.data;
    legs.value = data?.traverse_legs || [];
    traverse.value = data?.traverse || null;
  } catch (e) {
    error.value = true;
  } finally {
    loadingLocal.value = false;
  }
}

watch(selectedIndex, () => {
  // Only watch selectedIndex for cadastral surveys
  if (!isRouteType.value) {
    fetchComputation();
  }
});

onMounted(() => {
  if (isRouteType.value) {
    // For route surveys, fetch computation directly
    fetchComputation();
  } else {
    // For cadastral surveys, auto-select first parcel and fetch
    if (parcelsWithIndex.value.length) {
      selectedIndex.value = 0;
      fetchComputation();
    }
  }
});
</script>

<style scoped></style>
