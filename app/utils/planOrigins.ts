/**
 * Canonical, human-readable labels for plan origins.
 *
 * Mirrors `PLAN_ORIGIN_DISPLAY_NAMES` in the drawing engine
 * (`fyp-python/models/plan.py`) and `PLAN_ORIGIN_LABELS` in the API
 * (`fyp-api/src/modules/plan/plan.interface.ts`) so the form, the summary
 * screens and the generated plan all show the same text — with spaces, never
 * underscores (e.g. "UTM Zone 31", not "UTM_ZONE_31").
 *
 * Adding a new origin: add it here and to the two maps above.
 */
export interface PlanOriginOption {
  value: string;
  label: string;
}

export const PLAN_ORIGINS: PlanOriginOption[] = [
  { value: "utm_zone_31", label: "UTM Zone 31" },
  { value: "utm_zone_32", label: "UTM Zone 32" },
  { value: "utm_zone_33", label: "UTM Zone 33" },
];

export const PLAN_ORIGIN_LABELS: Record<string, string> = Object.fromEntries(
  PLAN_ORIGINS.map((origin) => [origin.value, origin.label])
);

/**
 * Display label for an origin value. Unknown origins fall back to the raw
 * value with underscores replaced by spaces, so they are still readable.
 */
export function formatPlanOrigin(
  origin: string | null | undefined,
  fallback = "—"
): string {
  if (!origin) return fallback;
  return PLAN_ORIGIN_LABELS[origin] ?? origin.replace(/_/g, " ");
}
