/**
 * In-app column mapping for uploaded coordinate files.
 *
 * Uploaded CSV/XLSX files don't always put ID/Northing/Easting/Elevation in the
 * order the app assumes. Rather than send users back to Excel to rearrange
 * columns, we let them map each field to a source column in-app. This module
 * holds the detection/auto-map/apply logic; the UI lives in
 * `components/CoordinateColumnMapper.vue`.
 *
 * The source file is never modified — mapping only re-derives the in-memory
 * coordinate rows.
 */

export type CoordinateField = "id" | "northing" | "easting" | "elevation";

export interface FieldDef {
  key: CoordinateField;
  label: string;
  required: boolean;
}

/** Column index chosen for each field (null = not mapped). */
export type ColumnMapping = Record<CoordinateField, number | null>;

export interface MappedCoordinate {
  point: string;
  northing: number | null;
  easting: number | null;
  elevation: number | null;
}

export interface DetectedColumns {
  hasHeader: boolean;
  /** Column count across the parsed rows. */
  columnCount: number;
  /** Header text per column when hasHeader, else "Column 1", "Column 2", … */
  headers: string[];
  /** Rows excluding the header row. */
  dataRows: string[][];
}

const HEADER_KEYWORDS =
  /point|\bpt\b|\bid\b|name|station|gcp|east|north|northing|easting|elev|elevation|height|level|\bz\b/i;

const FIELD_PATTERNS: Record<CoordinateField, RegExp> = {
  // Order matters at call sites, but each pattern is specific enough to stand
  // alone. "northing"/"easting" win over a bare "north"/"east".
  id: /point|\bpt\b|\bid\b|name|station|gcp/i,
  northing: /north/i,
  easting: /east/i,
  elevation: /elev|height|level|\bz\b/i,
};

const looksNumeric = (v: unknown): boolean => {
  if (v === undefined || v === null) return false;
  const s = String(v).trim();
  return s !== "" && Number.isFinite(Number(s));
};

/** Heuristic: is `row` a header row rather than data? */
function isHeaderRow(row: string[] | undefined): boolean {
  if (!row || !row.length) return false;
  const joined = row.join(" ");
  if (HEADER_KEYWORDS.test(joined)) return true;
  // If the coordinate columns don't look numeric but there's text, treat as header.
  const numericCount = [1, 2, 3].reduce(
    (c, i) => c + (looksNumeric(row[i]) ? 1 : 0),
    0,
  );
  return numericCount < 2 && /[a-z]/i.test(joined);
}

/** Split parsed rows into an optional header plus data rows. */
export function detectColumns(rows: string[][]): DetectedColumns {
  const clean = (rows || []).filter(
    (r) => Array.isArray(r) && r.some((c) => String(c ?? "").trim() !== ""),
  );
  const columnCount = clean.reduce((m, r) => Math.max(m, r.length), 0);

  const hasHeader = isHeaderRow(clean[0]);
  const headerRow = hasHeader ? clean[0] : [];
  const dataRows = hasHeader ? clean.slice(1) : clean;

  const headers = Array.from({ length: columnCount }, (_, i) => {
    const h = String(headerRow[i] ?? "").trim();
    return h || `Column ${i + 1}`;
  });

  return { hasHeader, columnCount, headers, dataRows };
}

/**
 * Best-guess mapping. Matches header names when present; otherwise falls back
 * to the app's historical positional order (ID, Easting, Northing, Elevation).
 */
export function autoDetectMapping(
  detected: DetectedColumns,
  fields: FieldDef[],
): ColumnMapping {
  const mapping = emptyMapping();
  const used = new Set<number>();

  if (detected.hasHeader) {
    for (const field of fields) {
      const idx = detected.headers.findIndex(
        (h, i) => !used.has(i) && FIELD_PATTERNS[field.key].test(h),
      );
      if (idx !== -1) {
        mapping[field.key] = idx;
        used.add(idx);
      }
    }
  }

  // Positional fallback for anything still unmapped.
  const positional: Record<CoordinateField, number> = {
    id: 0,
    easting: 1,
    northing: 2,
    elevation: 3,
  };
  for (const field of fields) {
    if (mapping[field.key] !== null) continue;
    const idx = positional[field.key];
    if (idx < detected.columnCount && !used.has(idx)) {
      mapping[field.key] = idx;
      used.add(idx);
    }
  }

  return mapping;
}

export function emptyMapping(): ColumnMapping {
  return { id: null, northing: null, easting: null, elevation: null };
}

/** Required fields that have no column assigned. */
export function unmappedRequiredFields(
  mapping: ColumnMapping,
  fields: FieldDef[],
): FieldDef[] {
  return fields.filter((f) => f.required && mapping[f.key] === null);
}

const toNumber = (v: unknown): number | null => {
  if (v === undefined || v === null || String(v).trim() === "") return null;
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
};

/** Re-derive coordinate rows from the chosen mapping. */
export function applyMapping(
  dataRows: string[][],
  mapping: ColumnMapping,
): MappedCoordinate[] {
  const cell = (row: string[], key: CoordinateField): string => {
    const idx = mapping[key];
    return idx === null ? "" : String(row[idx] ?? "").trim();
  };

  return dataRows
    .map((row) => ({
      point: cell(row, "id"),
      northing: toNumber(cell(row, "northing")),
      easting: toNumber(cell(row, "easting")),
      elevation: toNumber(cell(row, "elevation")),
    }))
    // Drop rows that carry no usable data at all.
    .filter(
      (r) =>
        r.point !== "" ||
        r.northing !== null ||
        r.easting !== null ||
        r.elevation !== null,
    );
}

// ---------------------------------------------------------------------------
// Session persistence — remember the mapping for files with the same shape so
// re-uploads of similar files don't need re-mapping.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "autoplan.columnMappings";

/** A signature that groups "similar" files (same columns / headers). */
export function mappingSignature(detected: DetectedColumns): string {
  const shape = detected.hasHeader
    ? detected.headers.join("|").toLowerCase()
    : `positional:${detected.columnCount}`;
  return `${detected.columnCount}::${shape}`;
}

type MappingStore = Record<string, ColumnMapping>;

function readStore(): MappingStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MappingStore) : {};
  } catch {
    return {};
  }
}

export function loadSessionMapping(signature: string): ColumnMapping | null {
  const store = readStore();
  return store[signature] ?? null;
}

export function saveSessionMapping(
  signature: string,
  mapping: ColumnMapping,
): void {
  if (typeof window === "undefined") return;
  try {
    const store = readStore();
    store[signature] = mapping;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage failures — mapping still works for this upload.
  }
}
