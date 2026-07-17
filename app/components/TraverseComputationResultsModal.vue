<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-[95vw] w-full max-h-[90vh] overflow-hidden"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600"
      >
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Traverse Computation Results
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Detailed traverse calculation results with coordinates and
            corrections
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-auto max-h-[calc(90vh-200px)]">
        <!-- Summary Info -->
        <div
          v-if="traverseInfo"
          class="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div class="text-sm font-medium text-blue-600 dark:text-blue-400">
              Total Distance
            </div>
            <div class="text-lg font-semibold text-blue-900 dark:text-blue-100">
              {{ traverseInfo.totalDistance }} m
            </div>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div class="text-sm font-medium text-green-600 dark:text-green-400">
              Number of Stations
            </div>
            <div
              class="text-lg font-semibold text-green-900 dark:text-green-100"
            >
              {{ traverseInfo.stations }}
            </div>
          </div>
          <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <div class="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
              Misclosure
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-amber-700 dark:text-amber-300">Northing:</span>
                <span class="font-mono text-amber-900 dark:text-amber-100">{{ traverseInfo.northingMisclosure }} m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-amber-700 dark:text-amber-300">Easting:</span>
                <span class="font-mono text-amber-900 dark:text-amber-100">{{ traverseInfo.eastingMisclosure }} m</span>
              </div>
            </div>
          </div>
          <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div class="text-sm font-medium text-purple-600 dark:text-purple-400">
              Area
            </div>
            <div
              class="text-lg font-semibold text-purple-900 dark:text-purple-100"
            >
              {{ traverseInfo.area }}
            </div>
          </div>
        </div>

        <!-- Main Results Table -->
        <div
          class="overflow-x-auto border border-gray-200 dark:border-slate-600 rounded-lg"
        >
          <table class="w-full text-xs">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th
                  rowspan="3"
                  class="px-2 py-3 text-left font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  From Stn
                </th>
                <th
                  rowspan="3"
                  class="px-2 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  Back Bearing <br />
                  Observed Angle <br />
                  Forward Bearing
                </th>
                <th
                  rowspan="3"
                  class="px-2 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  Corr. to<br />Bearing
                </th>
                <th
                  rowspan="3"
                  class="px-2 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  Corrected<br />Bearing
                </th>
                <th
                  rowspan="3"
                  class="px-2 py-3 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  Distance(m)
                </th>
                <th
                  colspan="6"
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  Co-ordinates of points
                </th>
                <th
                  colspan="2"
                  rowspan="2"
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  Uncorrected Co-ordinates<br />
                  Corrections to Co-ordinates <br />
                  Final Co-ordinates
                </th>
                <th
                  rowspan="3"
                  class="px-2 py-3 text-center font-medium text-gray-700 dark:text-gray-300"
                >
                  To Stn
                </th>
              </tr>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th
                  colspan="2"
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  L cos θ
                </th>

                <th
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                  rowspan="2"
                >
                  Arith<br />Sum
                </th>
                <th
                  colspan="2"
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  L sin θ
                </th>
                <th
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                  rowspan="2"
                >
                  Arith<br />Sum
                </th>
              </tr>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  N
                </th>
                <th
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  S
                </th>
                <th
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  E
                </th>
                <th
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  W
                </th>
                <th
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  Northing(m)
                </th>
                <th
                  class="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600"
                >
                  Easting(m)
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(leg, index) in computationData" :key="index">
                <!-- First sub-row -->
                <tr
                  class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  :class="{ 'text-red-600 dark:text-red-400': leg.fixed }"
                >
                  <!-- From Station -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center font-medium border-r border-gray-200 dark:border-slate-600"
                  >
                    {{ leg.from.id }}
                  </td>

                  <!-- Back Bearing -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.back_bearing
                        ? `${leg.back_bearing.degrees}°${leg.back_bearing.minutes}'${leg.back_bearing.seconds}"`
                        : "-"
                    }}
                  </td>

                  <!-- Bearing Correction -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.bearing_correction
                        ? `${leg.bearing_correction.degrees}°${leg.bearing_correction.minutes}'${leg.bearing_correction.seconds}"`
                        : "-"
                    }}
                  </td>

                  <!-- Corrected Bearing -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.forward_bearing
                        ? `${leg.forward_bearing.degrees}°${leg.forward_bearing.minutes}'${leg.forward_bearing.seconds}"`
                        : `${leg.bearing.degrees}°${leg.bearing.minutes}'${leg.bearing.seconds}"`
                    }}
                  </td>

                  <!-- Distance -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{ safeFixed(leg.distance, 3) }}
                  </td>

                  <!-- Length x Cos Brg (N) -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.delta_northing > 0
                        ? safeFixed(leg.delta_northing, 3)
                        : ""
                    }}
                  </td>

                  <!-- Length x Cos Brg (S) -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.delta_northing < 0
                        ? safeFixed(Math.abs(leg.delta_northing), 3)
                        : ""
                    }}
                  </td>

                  <!-- Arithmetic Sum (N/S) -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.arithmetic_sum_northing !== undefined
                        ? safeFixed(leg.arithmetic_sum_northing, 3)
                        : safeFixed(Math.abs(leg.delta_northing), 3)
                    }}
                  </td>

                  <!-- Length x Sin Brg (E) -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.delta_easting > 0
                        ? safeFixed(leg.delta_easting, 3)
                        : ""
                    }}
                  </td>

                  <!-- Length x Sin Brg (W) -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.delta_easting < 0
                        ? safeFixed(Math.abs(leg.delta_easting), 3)
                        : ""
                    }}
                  </td>

                  <!-- Arithmetic Sum (E/W) -->
                  <td
                    rowspan="3"
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.arithmetic_sum_easting !== undefined
                        ? safeFixed(leg.arithmetic_sum_easting, 3)
                        : safeFixed(Math.abs(leg.delta_easting), 3)
                    }}
                  </td>

                  <!-- Uncorrected Northing -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{ safeFixed(leg.to.uncorrected_northing, 3) }}
                  </td>

                  <!-- Uncorrected Easting -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{ safeFixed(leg.to.uncorrected_easting, 3) }}
                  </td>

                  <!-- To Station -->
                  <td rowspan="3" class="px-2 py-2 text-center font-medium">
                    {{ leg.to.id }}
                  </td>
                </tr>

                <!-- Second sub-row -->
                <tr
                  class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  :class="{ 'text-red-600 dark:text-red-400': leg.fixed }"
                >
                  <!-- Observed Angle -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.observed_angle
                        ? `${leg.observed_angle.degrees}°${leg.observed_angle.minutes}'${leg.observed_angle.seconds}"`
                        : "-"
                    }}
                  </td>

                  <!-- Correction dN -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.northing_misclosure !== undefined
                        ? safeFixed(leg.northing_misclosure, 6)
                        : ""
                    }}
                  </td>

                  <!-- Correction dE -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.easting_misclosure !== undefined
                        ? safeFixed(leg.easting_misclosure, 6)
                        : ""
                    }}
                  </td>
                </tr>

                <!-- Third sub-row -->
                <tr
                  class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  :class="{ 'text-red-600 dark:text-red-400': leg.fixed }"
                >
                  <!-- Forward Bearing -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                  >
                    {{
                      leg.forward_bearing
                        ? `${leg.forward_bearing.degrees}°${leg.forward_bearing.minutes}'${leg.forward_bearing.seconds}"`
                        : `${leg.bearing.degrees}°${leg.bearing.minutes}'${leg.bearing.seconds}"`
                    }}
                  </td>

                  <!-- Final Northing -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                    :class="misclosureApplied || leg.fixed ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'"
                  >
                    {{ safeFixed(leg.to.northing, 3) }}
                  </td>

                  <!-- Final Easting -->
                  <td
                    class="px-2 py-2 text-center border-r border-gray-200 dark:border-slate-600"
                    :class="misclosureApplied || leg.fixed ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'"
                  >
                    {{ safeFixed(leg.to.easting, 3) }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-600"
      >
        <button
          @click="exportToCSV"
          class="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Export CSV
        </button>
        <button
          v-if="canSaveCoordinates"
          @click="saveCoordinates"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Coordinates
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

// Helper function to safely format numbers and handle NaN/undefined values
function safeFixed(
  value: number | undefined | null,
  decimals: number = 3
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "";
  }
  return value.toFixed(decimals);
}

// Format an area in square metres, adding a hectares equivalent for large areas.
// Returns an em dash while the value is unavailable (e.g. before the backend supplies it).
function formatArea(area: number | undefined | null): string {
  if (area === undefined || area === null || isNaN(area)) {
    return "—";
  }
  if (area >= 10000) {
    const hectares = area / 10000;
    return `${area.toFixed(3)} sqm (${hectares.toFixed(3)} hectares)`;
  }
  return `${area.toFixed(3)} sqm`;
}

interface TraverseResults {
  traverse_legs: Array<{
    from: {
      id: string;
      northing: number;
      easting: number;
      uncorrected_northing?: number;
      uncorrected_easting?: number;
    };
    to: {
      id: string;
      northing: number;
      easting: number;
      uncorrected_northing?: number;
      uncorrected_easting?: number;
    };
    distance: number;
    bearing: {
      degrees: number;
      minutes: number;
      seconds: number;
      decimal: number;
    };
    delta_northing: number;
    delta_easting: number;
    arithmetic_sum_northing?: number;
    arithmetic_sum_easting?: number;
    northing_misclosure?: number;
    easting_misclosure?: number;
    observed_angle?: {
      degrees: number;
      minutes: number;
      seconds: number;
    };
    back_bearing?: {
      degrees: number;
      minutes: number;
      seconds: number;
      decimal: number;
    };
    forward_bearing?: {
      degrees: number;
      minutes: number;
      seconds: number;
      decimal: number;
    };
    bearing_correction?: {
      degrees: number;
      minutes: number;
      seconds: number;
      decimal: number;
    };
    fixed?: boolean;
  }>;
  // Populated by the backend; may arrive at the top level or nested under `traverse`.
  area?: number;
  traverse?: {
    area?: number;
  };
}

const props = defineProps<{
  show: boolean;
  results: TraverseResults | null;
  canSaveCoordinates?: boolean;
  // When true, the misclosure correction has been applied, so the final
  // northing/easting coordinates are highlighted in red.
  misclosureApplied?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  "save-coordinates": [
    coordinates: Array<{
      point: string;
      easting: number;
      northing: number;
      elevation: number | null;
    }>
  ];
}>();

const computationData = computed(() => {
  if (!props.results?.traverse_legs) return [];
  return props.results.traverse_legs;
});

const traverseInfo = computed(() => {
  if (!props.results?.traverse_legs) return null;

  const legs = props.results.traverse_legs;
  const totalDistance = legs.reduce((sum, leg) => {
    const distance = leg.distance;
    return sum + (isNaN(distance) ? 0 : distance);
  }, 0);

  const northingMisclosure = legs.reduce((sum, leg) => {
    const delta = leg.delta_northing;
    return sum + (isNaN(delta) ? 0 : delta);
  }, 0);

  const eastingMisclosure = legs.reduce((sum, leg) => {
    const delta = leg.delta_easting;
    return sum + (isNaN(delta) ? 0 : delta);
  }, 0);

  // Area may be returned at the top level or nested under `traverse`,
  // depending on the endpoint. Blank until the backend populates it.
  const rawArea = props.results?.area ?? props.results?.traverse?.area;

  return {
    totalDistance: safeFixed(totalDistance, 3),
    stations: legs.length,
    northingMisclosure: safeFixed(northingMisclosure, 6),
    eastingMisclosure: safeFixed(eastingMisclosure, 6),
    area: formatArea(rawArea),
  };
});

function exportToCSV() {
  if (!props.results?.traverse_legs) return;

  const headers = [
    "From_Station",
    "Back_Bearing_Deg",
    "Back_Bearing_Min", 
    "Back_Bearing_Sec",
    "Observed_Angle_Deg",
    "Observed_Angle_Min",
    "Observed_Angle_Sec",
    "Forward_Bearing_Deg",
    "Forward_Bearing_Min",
    "Forward_Bearing_Sec",
    "Bearing_Correction_Deg",
    "Bearing_Correction_Min",
    "Bearing_Correction_Sec",
    "Corrected_Bearing_Deg",
    "Corrected_Bearing_Min",
    "Corrected_Bearing_Sec",
    "Distance_m",
    "L_cos_theta_N",
    "L_cos_theta_S",
    "Arith_Sum_N_S",
    "L_sin_theta_E",
    "L_sin_theta_W", 
    "Arith_Sum_E_W",
    "Uncorrected_Northing",
    "Uncorrected_Easting",
    "Correction_dN",
    "Correction_dE",
    "Final_Northing",
    "Final_Easting",
    "To_Station",
  ];

  // Create rows for each leg with 3 sub-rows to match table structure
  const rows: string[][] = [];
  
  props.results.traverse_legs.forEach((leg) => {
    // First sub-row (Back Bearing)
    rows.push([
      leg.from.id,
      leg.back_bearing?.degrees?.toString() || "",
      leg.back_bearing?.minutes?.toString() || "",
      leg.back_bearing?.seconds?.toString() || "",
      "", // Observed angle empty in first row
      "",
      "",
      "", // Forward bearing empty in first row
      "",
      "",
      leg.bearing_correction?.degrees?.toString() || "",
      leg.bearing_correction?.minutes?.toString() || "",
      leg.bearing_correction?.seconds?.toString() || "",
      leg.forward_bearing?.degrees?.toString() || leg.bearing.degrees.toString(),
      leg.forward_bearing?.minutes?.toString() || leg.bearing.minutes.toString(),
      leg.forward_bearing?.seconds?.toString() || leg.bearing.seconds.toString(),
      safeFixed(leg.distance, 3),
      leg.delta_northing > 0 ? safeFixed(leg.delta_northing, 3) : "",
      leg.delta_northing < 0 ? safeFixed(Math.abs(leg.delta_northing), 3) : "",
      leg.arithmetic_sum_northing !== undefined ? safeFixed(leg.arithmetic_sum_northing, 3) : safeFixed(Math.abs(leg.delta_northing), 3),
      leg.delta_easting > 0 ? safeFixed(leg.delta_easting, 3) : "",
      leg.delta_easting < 0 ? safeFixed(Math.abs(leg.delta_easting), 3) : "",
      leg.arithmetic_sum_easting !== undefined ? safeFixed(leg.arithmetic_sum_easting, 3) : safeFixed(Math.abs(leg.delta_easting), 3),
      safeFixed(leg.to.uncorrected_northing, 3),
      safeFixed(leg.to.uncorrected_easting, 3),
      "", // Correction dN empty in first row
      "", // Correction dE empty in first row  
      "", // Final northing empty in first row
      "", // Final easting empty in first row
      leg.to.id,
    ]);

    // Second sub-row (Observed Angle + Corrections)
    rows.push([
      "", // From station spans 3 rows
      "", // Back bearing empty in second row
      "",
      "",
      leg.observed_angle?.degrees?.toString() || "",
      leg.observed_angle?.minutes?.toString() || "",
      leg.observed_angle?.seconds?.toString() || "",
      "", // Forward bearing empty in second row
      "",
      "",
      "", // Bearing correction spans 3 rows
      "",
      "",
      "", // Corrected bearing spans 3 rows
      "",
      "",
      "", // Distance spans 3 rows
      "", // L cos theta spans 3 rows
      "",
      "", // Arith sum spans 3 rows
      "", // L sin theta spans 3 rows
      "",
      "", // Arith sum spans 3 rows
      "", // Uncorrected coords empty in second row
      "",
      leg.northing_misclosure !== undefined ? safeFixed(leg.northing_misclosure, 6) : "",
      leg.easting_misclosure !== undefined ? safeFixed(leg.easting_misclosure, 6) : "",
      "", // Final coords empty in second row
      "",
      "", // To station spans 3 rows
    ]);

    // Third sub-row (Forward Bearing + Final Coordinates)
    rows.push([
      "", // From station spans 3 rows
      "", // Back bearing empty in third row
      "",
      "",
      "", // Observed angle empty in third row
      "",
      "",
      leg.forward_bearing?.degrees?.toString() || leg.bearing.degrees.toString(),
      leg.forward_bearing?.minutes?.toString() || leg.bearing.minutes.toString(),
      leg.forward_bearing?.seconds?.toString() || leg.bearing.seconds.toString(),
      "", // Bearing correction spans 3 rows
      "",
      "",
      "", // Corrected bearing spans 3 rows
      "",
      "",
      "", // Distance spans 3 rows
      "", // L cos theta spans 3 rows
      "",
      "", // Arith sum spans 3 rows
      "", // L sin theta spans 3 rows
      "",
      "", // Arith sum spans 3 rows
      "", // Uncorrected coords empty in third row
      "",
      "", // Corrections empty in third row
      "",
      safeFixed(leg.to.northing, 3),
      safeFixed(leg.to.easting, 3),
      "", // To station spans 3 rows
    ]);
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "traverse_computation_results.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function saveCoordinates() {
  if (!props.results?.traverse_legs) return;

  const coordinates = props.results.traverse_legs.map((leg) => ({
    point: leg.to.id,
    easting: leg.to.easting,
    northing: leg.to.northing,
    elevation: null as number | null,
  }));

  emit("save-coordinates", coordinates);
}
</script>
