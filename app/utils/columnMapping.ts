/**
 * In-app column mapping for uploaded data files.
 *
 * Uploaded CSV/XLSX files don't always put their columns in the order the app
 * assumes. Rather than send users back to Excel to rearrange them, we let them
 * map each field to a source column in-app. This module holds the
 * detection/auto-map/apply logic; the UI lives in
 * `components/CoordinateColumnMapper.vue`.
 *
 * The field set is supplied by the caller, so the same mapper serves a
 * coordinate upload, a levelling sheet and a traverse field book. Presets for
 * the common shapes are at the bottom of this file.
 *
 * The source file is never modified — mapping only re-derives the in-memory
 * rows.
 */

export type FieldKey = string;

export interface FieldDef {
  key: FieldKey;
  label: string;
  required: boolean;
  /**
   * Header text that identifies this field. Fields are matched in the order
   * they are declared, so put the specific patterns first — "northing" must be
   * offered a header before a bare "north" pattern can claim it.
   */
  pattern?: RegExp;
  /** Column index used when the file has no header to match against. */
  position?: number;
  /** Numbers are parsed; text is kept as entered. Defaults to number. */
  type?: "text" | "number";
  /** Placeholder for this field's input in a caller's table. */
  placeholder?: string;
}

/** Column index chosen for each field (null = not mapped). */
export type ColumnMapping = Record<FieldKey, number | null>;

/** One re-derived row, keyed by field. */
export type MappedRow = Record<FieldKey, string | number | null>;

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
  /point|\bpt\b|\bid\b|name|station|gcp|east|north|northing|easting|elev|elevation|height|level|\bz\b|sight|chainage|dist|bearing|deg|min|sec|angle|rise|fall/i;

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
  // If the leading value columns don't look numeric but there's text, treat as
  // a header. Column 0 is skipped: it is usually a point or station name, and
  // is non-numeric in the header and the data alike.
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
 * Best-guess mapping. Matches header names when present, then falls back to
 * each field's declared position for anything still unmapped.
 */
export function autoDetectMapping(
  detected: DetectedColumns,
  fields: FieldDef[],
): ColumnMapping {
  const mapping = emptyMapping(fields);
  const used = new Set<number>();

  if (detected.hasHeader) {
    for (const field of fields) {
      if (!field.pattern) continue;
      const idx = detected.headers.findIndex(
        (h, i) => !used.has(i) && field.pattern!.test(h),
      );
      if (idx !== -1) {
        mapping[field.key] = idx;
        used.add(idx);
      }
    }
  }

  for (const field of fields) {
    if (mapping[field.key] !== null) continue;
    const idx = field.position;
    if (idx !== undefined && idx < detected.columnCount && !used.has(idx)) {
      mapping[field.key] = idx;
      used.add(idx);
    }
  }

  return mapping;
}

export function emptyMapping(fields: FieldDef[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  for (const field of fields) mapping[field.key] = null;
  return mapping;
}

/** Required fields that have no column assigned. */
export function unmappedRequiredFields(
  mapping: ColumnMapping,
  fields: FieldDef[],
): FieldDef[] {
  return fields.filter((f) => f.required && mapping[f.key] == null);
}

/**
 * The fields in the order their source columns appear in the file, so a table
 * built from this mirrors the layout the surveyor uploaded. Swapping two
 * fields in the mapper reorders the table with them. Unmapped fields keep
 * their declared order and sort last — they have no column to sit beside.
 */
export function orderedFields(
  fields: FieldDef[],
  mapping: ColumnMapping,
): FieldDef[] {
  return [...fields].sort((a, b) => {
    const ai = mapping[a.key];
    const bi = mapping[b.key];
    if (ai == null && bi == null) return fields.indexOf(a) - fields.indexOf(b);
    if (ai == null) return 1;
    if (bi == null) return -1;
    return ai - bi;
  });
}

const toNumber = (v: unknown): number | null => {
  if (v === undefined || v === null || String(v).trim() === "") return null;
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
};

/** Re-derive rows from the chosen mapping, keyed by field. */
export function applyMapping(
  dataRows: string[][],
  mapping: ColumnMapping,
  fields: FieldDef[],
): MappedRow[] {
  return dataRows
    .map((row) => {
      const out: MappedRow = {};
      for (const field of fields) {
        const idx = mapping[field.key];
        const raw = idx == null ? "" : String(row[idx] ?? "").trim();
        out[field.key] = field.type === "text" ? raw : toNumber(raw);
      }
      return out;
    })
    // Drop rows that carry no usable data at all.
    .filter((r) =>
      fields.some((f) => {
        const v = r[f.key];
        return v !== null && v !== "";
      }),
    );
}

// ---------------------------------------------------------------------------
// Field presets
// ---------------------------------------------------------------------------

/**
 * Positions are the app's historical column order for a coordinate file
 * (ID, Easting, Northing, Elevation), used when a file has no header.
 */
export const ID_FIELD: FieldDef = {
  key: "id",
  label: "Point ID",
  required: true,
  pattern: /point|\bpt\b|\bid\b|name|station|gcp/i,
  position: 0,
  type: "text",
};

export const EASTING_FIELD: FieldDef = {
  key: "easting",
  label: "Easting",
  required: true,
  pattern: /east/i,
  position: 1,
};

export const NORTHING_FIELD: FieldDef = {
  key: "northing",
  label: "Northing",
  required: true,
  pattern: /north/i,
  position: 2,
};

export const ELEVATION_FIELD: FieldDef = {
  key: "elevation",
  label: "Elevation",
  required: false,
  pattern: /elev|height|level|\bz\b/i,
  position: 3,
};

/** ID / Northing / Easting, with elevation optional unless overridden. */
export const COORDINATE_FIELDS: FieldDef[] = [
  ID_FIELD,
  NORTHING_FIELD,
  EASTING_FIELD,
];

export const COORDINATE_FIELDS_WITH_ELEVATION: FieldDef[] = [
  ID_FIELD,
  NORTHING_FIELD,
  EASTING_FIELD,
  ELEVATION_FIELD,
];

/** Marks a preset field required or optional without mutating the preset. */
export const asRequired = (field: FieldDef, required = true): FieldDef => ({
  ...field,
  required,
});

// ---------------------------------------------------------------------------
// Session persistence — remember the mapping for files with the same shape so
// re-uploads of similar files don't need re-mapping.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "autoplan.columnMappings";

/**
 * A signature that groups "similar" files (same columns / headers). The field
 * keys are part of it: the same file uploaded to a coordinate table and to a
 * levelling sheet is not the same mapping.
 */
export function mappingSignature(
  detected: DetectedColumns,
  fields: FieldDef[] = [],
): string {
  const shape = detected.hasHeader
    ? detected.headers.join("|").toLowerCase()
    : `positional:${detected.columnCount}`;
  const shapeKey = fields.map((f) => f.key).join(",");
  return `${detected.columnCount}::${shape}::${shapeKey}`;
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
