import { onMounted, watch } from "vue";
import { useState } from "#imports";
import {
  DEFAULT_COORDINATE_PRECISION,
  formatCoordinate,
  loadCoordinatePrecision,
  saveCoordinatePrecision,
  type CoordinatePrecision,
} from "~/utils/formatCoordinate";

export function useCoordinatePrecision() {
  const coordinatePrecision = useState<CoordinatePrecision>(
    "coordinate-precision",
    () => DEFAULT_COORDINATE_PRECISION,
  );

  onMounted(() => {
    coordinatePrecision.value = loadCoordinatePrecision();
  });

  watch(coordinatePrecision, (precision) => saveCoordinatePrecision(precision));

  const formatCoordinateValue = (
    value: number | string | null | undefined,
    fallback = "—",
  ) => formatCoordinate(value, coordinatePrecision.value, fallback);

  return { coordinatePrecision, formatCoordinateValue };
}
