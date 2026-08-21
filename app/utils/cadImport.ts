/**
 * Types and helpers for importing a legacy CAD drawing (Task 11).
 *
 * The drawing engine does the reading: it converts DWG to DXF, recovers every
 * closed shape, matches station labels to corners and turns each shape into a
 * coordinate register. This module only describes that response and formats it
 * — deliberately no geometry of its own, so there is one implementation of the
 * import rules rather than a second copy here that has to be kept in step.
 */

export interface CadVertex {
  easting: number;
  northing: number;
  elevation: number;
}

export interface CadStation {
  id: string;
  easting: number;
  northing: number;
  elevation: number;
  /** The id was invented because the drawing carried no name for that corner. */
  generated: boolean;
}

export interface CadRing {
  id: string;
  layer: string;
  source: "polyline" | "chained";
  vertices: CadVertex[];
  area: number;
  perimeter: number;
  centroid_easting: number;
  centroid_northing: number;
  gap_closed: number | null;
  coordinates: CadStation[];
}

export interface CadPoint {
  easting: number;
  northing: number;
  elevation: number;
  layer: string;
  block: string;
  label: string | null;
}

export interface CadLayer {
  name: string;
  entity_count: number;
  ring_count: number;
  point_count: number;
  label_count: number;
  entity_types: string[];
}

export interface CadInspection {
  file_name: string;
  file_format: string;
  dxf_version: string;
  units: string;
  units_code: number;
  units_factor: number;
  min_easting: number | null;
  min_northing: number | null;
  max_easting: number | null;
  max_northing: number | null;
  layers: CadLayer[];
  rings: CadRing[];
  points: CadPoint[];
  warnings: string[];
}

/**
 * Units a user can force when the drawing's own header is missing or wrong.
 * The codes are DXF `$INSUNITS` values, which is what the engine expects.
 */
export const UNIT_OPTIONS: { code: number; label: string }[] = [
  { code: 6, label: "Metres" },
  { code: 2, label: "Feet" },
  { code: 21, label: "US survey feet" },
  { code: 4, label: "Millimetres" },
  { code: 5, label: "Centimetres" },
  { code: 1, label: "Inches" },
  { code: 0, label: "Unspecified (treat as metres)" },
];

export const CAD_EXTENSIONS = [".dwg", ".dxf"];

export const isCadFile = (fileName: string): boolean => {
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) return false;
  return CAD_EXTENSIONS.includes(fileName.slice(dot).toLowerCase());
};

/** `12500 m²` or, past a hectare, `12500.0 m² (1.250 ha)`. */
export const formatRingArea = (area: number): string =>
  area >= 10000
    ? `${area.toFixed(1)} m² (${(area / 10000).toFixed(3)} ha)`
    : `${area.toFixed(1)} m²`;

/**
 * Ring vertices as an SVG polygon path, normalised into a `size`-unit box.
 * Northings are flipped because SVG's y axis runs down the screen.
 */
export const ringToSvgPoints = (ring: CadRing, size = 40, pad = 3): string => {
  const xs = ring.vertices.map((v) => v.easting);
  const ys = ring.vertices.map((v) => v.northing);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const span = Math.max(Math.max(...xs) - minX, Math.max(...ys) - minY) || 1;
  const scale = (size - pad * 2) / span;

  return ring.vertices
    .map((v) => {
      const x = pad + (v.easting - minX) * scale;
      const y = size - pad - (v.northing - minY) * scale;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};
