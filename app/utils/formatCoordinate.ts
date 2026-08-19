/**
 * Coordinate display formatting.
 *
 * Surveyors write coordinates as plain numbers — 735780, never 735,780 — so a
 * locale thousands separator is wrong here and a hazard when values are copied
 * into CAD or a spreadsheet. This helper formats without any grouping
 * separator and lets a user pick a display precision (decimal places or
 * significant figures).
 *
 * It is DISPLAY-ONLY. The stored coordinates and the payload sent to plan
 * generation must never be rounded through this, or computed areas and
 * bearings would shift. CSV export keeps full precision for the same reason.
 */

export type CoordinatePrecision =
  | "raw"
  | `dp:${number}`
  | `sf:${number}`;

export interface CoordinatePrecisionOption {
  value: CoordinatePrecision;
  label: string;
}

/** Options offered by the precision dropdown, in display order. */
export const COORDINATE_PRECISION_OPTIONS: CoordinatePrecisionOption[] = [
  { value: "raw", label: "Raw" },
  { value: "dp:0", label: "0 d.p." },
  { value: "dp:1", label: "1 d.p." },
  { value: "dp:2", label: "2 d.p." },
  { value: "dp:3", label: "3 d.p." },
  { value: "dp:4", label: "4 d.p." },
  { value: "sf:3", label: "3 s.f." },
  { value: "sf:4", label: "4 s.f." },
  { value: "sf:5", label: "5 s.f." },
  { value: "sf:6", label: "6 s.f." },
];

export const DEFAULT_COORDINATE_PRECISION: CoordinatePrecision = "raw";

const STORAGE_KEY = "autoplan.coordinatePrecision";

/** Round to `figures` significant figures and render in plain (non-exponential,
 * non-grouped) decimal notation, e.g. 735780 @ 3 s.f. -> "736000". */
function toSignificantFigures(value: number, figures: number): string {
  if (!Number.isFinite(value) || figures < 1) return String(value);
  if (value === 0) return "0";

  const digitsBeforePoint = Math.ceil(Math.log10(Math.abs(value)));
  const decimals = figures - digitsBeforePoint;
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(value * factor) / factor;
  // Negative `decimals` means we rounded to tens/hundreds/… — no fractional part.
  return rounded.toFixed(Math.max(decimals, 0));
}

/**
 * Format a single coordinate value for display. Never groups thousands.
 * Returns `fallback` for null/blank/non-numeric input.
 */
export function formatCoordinate(
  value: number | string | null | undefined,
  precision: CoordinatePrecision = DEFAULT_COORDINATE_PRECISION,
  fallback = "—",
): string {
  if (value === null || value === undefined || value === "") return fallback;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value);

  if (precision === "raw") {
    // Shortest round-trip decimal; no grouping, no forced trailing zeros.
    return String(n);
  }

  const [mode, rawAmount] = precision.split(":");
  const amount = Number(rawAmount);
  if (!Number.isFinite(amount)) return String(n);

  if (mode === "dp") return n.toFixed(Math.max(0, Math.trunc(amount)));
  if (mode === "sf") return toSignificantFigures(n, Math.max(1, Math.trunc(amount)));
  return String(n);
}

/** Whether `value` is one of the precisions we know how to render. */
export function isCoordinatePrecision(value: unknown): value is CoordinatePrecision {
  return (
    typeof value === "string" &&
    COORDINATE_PRECISION_OPTIONS.some((o) => o.value === value)
  );
}

/** Load the persisted precision choice (per browser). */
export function loadCoordinatePrecision(): CoordinatePrecision {
  if (typeof window === "undefined") return DEFAULT_COORDINATE_PRECISION;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isCoordinatePrecision(saved)) return saved;
  } catch {
    // localStorage unavailable (private mode / SSR) — fall through to default.
  }
  return DEFAULT_COORDINATE_PRECISION;
}

/** Persist the precision choice so it survives a reload. */
export function saveCoordinatePrecision(precision: CoordinatePrecision): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, precision);
  } catch {
    // Ignore write failures (private mode / quota) — display still works.
  }
}
