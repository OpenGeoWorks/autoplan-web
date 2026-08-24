/**
 * What is worth showing about a plan, per plan type.
 *
 * The report step and the plan page both summarise a plan, and both had grown
 * their own idea of what that meant: between them they showed the four
 * longitudinal-profile numbers but not the route's own parameters, six of the
 * topographic settings but not whether the TIN mesh or the coordinate grid
 * were on, and for a layout plan nothing at all -- no boundary, no plots, no
 * roads. A plan whose whole content is its subdivision was summarised by its
 * font.
 *
 * Two pages showing the same thing is what made them drift, so the answer
 * lives here once and both render it. Sections are plain data rather than
 * markup so neither page has to know which fields belong to which type.
 */

export interface SummaryItem {
  label: string;
  value: string;
  /** Set when the value needs a second line under it. */
  note?: string;
}

export interface SummarySection {
  title: string;
  items: SummaryItem[];
}

const DASH = "—";

const count = (n: unknown): string =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : DASH;

const metres = (n: unknown, digits = 2): string =>
  typeof n === "number" && Number.isFinite(n)
    ? `${n.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })} m`
    : DASH;

/** Square metres, with hectares alongside once the figure stops being legible. */
const area = (n: unknown): string => {
  if (typeof n !== "number" || !Number.isFinite(n)) return DASH;
  const sqm = `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} m²`;
  return n >= 10000 ? `${sqm} (${(n / 10000).toFixed(3)} ha)` : sqm;
};

const yesNo = (v: unknown): string => (v === undefined || v === null ? DASH : v ? "Yes" : "No");

const date = (value: unknown): string => {
  if (!value) return DASH;
  const when = new Date(value as string);
  return Number.isNaN(when.getTime())
    ? DASH
    : when.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const titleCase = (s: unknown): string =>
  typeof s === "string" && s
    ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : DASH;

/** Drop the rows a plan has nothing to say about, and the sections left empty. */
const section = (title: string, items: (SummaryItem | null)[]): SummarySection | null => {
  const kept = items.filter((i): i is SummaryItem => i !== null);
  return kept.length ? { title, items: kept } : null;
};

const sum = (values: (number | undefined)[]): number | undefined => {
  const known = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  return known.length ? known.reduce((a, b) => a + b, 0) : undefined;
};

/**
 * The survey itself: how many points there are and where they came from.
 *
 * `point_count` rather than `coordinates.length`, because an uploaded survey
 * keeps only a preview on the document -- a plan of 1.5 million spot heights
 * was reporting 200.
 */
const surveySection = (plan: any): SummarySection | null => {
  const stored = plan?.point_count;
  const preview = Array.isArray(plan?.coordinates) ? plan.coordinates.length : 0;
  const total = typeof stored === "number" && stored > 0 ? stored : preview;
  const source = plan?.point_source;

  return section("Survey", [
    total
      ? {
          label: plan?.type === "topographic" ? "Survey points" : "Coordinates",
          value: count(total),
          note:
            total > preview && preview
              ? `${count(preview)} held on the plan for preview; the rest are in the point store`
              : undefined,
        }
      : null,
    source?.file_name
      ? {
          label: "Uploaded from",
          value: String(source.file_name),
          note: source.skipped_rows
            ? `${count(source.skipped_rows)} row(s) skipped as unreadable`
            : undefined,
        }
      : null,
    source?.uploaded_at ? { label: "Uploaded", value: date(source.uploaded_at) } : null,
  ]);
};

/** The sheet the plan is drawn on, and the last time it was drawn. */
const sheetSection = (plan: any): SummarySection | null =>
  section("Sheet", [
    plan?.scale ? { label: "Scale", value: `1:${Number(plan.scale).toLocaleString()}` } : null,
    plan?.page_size
      ? {
          label: "Paper",
          value: `${plan.page_size} ${titleCase(plan.page_orientation || "portrait")}`,
        }
      : null,
    // Absent means off -- the engine draws no schedule unless asked -- so
    // these read No rather than "not recorded".
    {
      label: "Bearing & distance schedule",
      value: yesNo(!!plan?.show_bearing_distance_table),
    },
    { label: "Coordinate schedule", value: yesNo(!!plan?.show_coordinate_table) },
    plan?.generated?.generated_at
      ? {
          label: "Last drawn",
          value: date(plan.generated.generated_at),
          note: plan.generated.scale
            ? `at 1:${Number(plan.generated.scale).toLocaleString()}`
            : undefined,
        }
      : null,
  ]);

const cadastralSections = (plan: any): (SummarySection | null)[] => {
  const parcels: any[] = Array.isArray(plan?.parcels) ? plan.parcels : [];
  const legs = sum(parcels.map((p) => (Array.isArray(p?.legs) ? p.legs.length : undefined)));

  return [
    section("Parcels", [
      { label: "Parcels", value: count(parcels.length) },
      { label: "Total area", value: area(sum(parcels.map((p) => p?.area))) },
      legs ? { label: "Legs", value: count(legs) } : null,
      ...parcels.slice(0, 8).map((p) => ({
        label: p?.name || "Parcel",
        value: area(p?.area),
        note: Array.isArray(p?.ids) ? `${p.ids.length} corners` : undefined,
      })),
      parcels.length > 8
        ? { label: "", value: `and ${count(parcels.length - 8)} more` }
        : null,
    ]),
  ];
};

const topographicSections = (plan: any): (SummarySection | null)[] => {
  const setting = plan?.topographic_setting;
  const boundary = plan?.topographic_boundary;

  return [
    section("Boundary", [
      {
        label: "Boundary points",
        value: count(Array.isArray(boundary?.coordinates) ? boundary.coordinates.length : 0),
      },
      { label: "Area", value: area(boundary?.area) },
      Array.isArray(boundary?.legs)
        ? { label: "Legs", value: count(boundary.legs.length) }
        : null,
    ]),
    section("Contours", [
      { label: "Contours drawn", value: yesNo(setting?.show_contours) },
      { label: "Interval", value: metres(setting?.contour_interval) },
      { label: "Major contour", value: metres(setting?.major_contour) },
      { label: "Contour labels", value: yesNo(setting?.show_contours_labels) },
      setting?.minimum_distance !== undefined
        ? { label: "Smoothing", value: String(setting.minimum_distance) }
        : null,
    ]),
    section("Surface & symbols", [
      { label: "Spot heights", value: yesNo(setting?.show_spot_heights) },
      { label: "TIN mesh", value: yesNo(setting?.show_tin_mesh ?? setting?.tin) },
      { label: "Coordinate grid", value: yesNo(setting?.show_grid ?? setting?.grid) },
      { label: "Boundary drawn", value: yesNo(setting?.show_boundary) },
    ]),
  ];
};

const layoutSections = (plan: any): (SummarySection | null)[] => {
  const boundary = plan?.layout_boundary;
  const plots: any[] = Array.isArray(plan?.plots) ? plan.plots : [];
  const roads: any[] = Array.isArray(plan?.roads) ? plan.roads : [];
  const params = plan?.layout_parameters;
  const generated = plan?.layout_mode !== "draw";

  // The land-use split the drawn schedule reports, worked out the same way.
  const byUse = new Map<string, { plots: number; area: number }>();
  for (const plot of plots) {
    const use = String(plot?.use || "unspecified");
    const entry = byUse.get(use) ?? { plots: 0, area: 0 };
    entry.plots += 1;
    entry.area += typeof plot?.area === "number" ? plot.area : 0;
    byUse.set(use, entry);
  }

  return [
    section("Site", [
      {
        label: "Boundary points",
        value: count(Array.isArray(boundary?.coordinates) ? boundary.coordinates.length : 0),
      },
      { label: "Site area", value: area(boundary?.area) },
      {
        label: "Layout mode",
        value: generated ? "Auto-generated subdivision" : "Drawn as entered",
      },
    ]),
    section("Land use", [
      { label: "Plots", value: count(plots.length) },
      { label: "Roads", value: count(roads.length) },
      ...Array.from(byUse.entries())
        .sort((a, b) => b[1].area - a[1].area)
        .map(([use, entry]) => ({
          label: titleCase(use),
          value: `${count(entry.plots)} plot${entry.plots === 1 ? "" : "s"}`,
          note: entry.area ? area(entry.area) : undefined,
        })),
    ]),
    generated
      ? section("Subdivision parameters", [
          params?.plot
            ? {
                label: "Plot module",
                value: `${metres(params.plot.frontage, 1)} × ${metres(params.plot.depth, 1)}`,
                note:
                  params.plot.min_area !== undefined
                    ? `minimum ${area(params.plot.min_area)}`
                    : undefined,
              }
            : null,
          params?.roads
            ? {
                label: "Road widths",
                value: `${metres(params.roads.major_width, 1)} major · ${metres(
                  params.roads.collector_width,
                  1,
                )} collector · ${metres(params.roads.access_width, 1)} access`,
                note: params.roads.major_road_name || undefined,
              }
            : null,
          params?.blocks
            ? {
                label: "Blocks",
                value: `up to ${metres(params.blocks.max_length, 0)} long`,
                note: params.blocks.double_loaded ? "double loaded" : "single loaded",
              }
            : null,
          params?.reserves
            ? {
                label: "Open space",
                value:
                  params.reserves.open_space_percent !== undefined
                    ? `${params.reserves.open_space_percent}%`
                    : DASH,
                note: (params.reserves.facilities || []).length
                  ? `facilities: ${(params.reserves.facilities || [])
                      .map(titleCase)
                      .join(", ")}`
                  : undefined,
              }
            : null,
        ])
      : section("Roads", [
          ...roads.slice(0, 8).map((r) => ({
            label: r?.name || "Road",
            value: metres(r?.width, 1),
            note: Array.isArray(r?.centerline_ids)
              ? `${r.centerline_ids.length} centreline points`
              : undefined,
          })),
          roads.length > 8
            ? { label: "", value: `and ${count(roads.length - 8)} more` }
            : null,
        ]),
  ];
};

const routeSections = (plan: any): (SummarySection | null)[] => {
  const elevations: any[] = Array.isArray(plan?.elevations) ? plan.elevations : [];
  const profile = plan?.longitudinal_profile_parameters;
  const route = plan?.route_parameters;
  const levels = elevations
    .map((e) => e?.elevation)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));

  return [
    section("Alignment", [
      { label: "Stations", value: count(elevations.length) },
      elevations.length
        ? {
            label: "Chainage",
            value: `${elevations[0]?.chainage ?? DASH} to ${
              elevations[elevations.length - 1]?.chainage ?? DASH
            }`,
          }
        : null,
      levels.length
        ? {
            label: "Elevation range",
            value: `${metres(Math.min(...levels))} to ${metres(Math.max(...levels))}`,
            note: `${metres(Math.max(...levels) - Math.min(...levels))} of relief`,
          }
        : null,
      route?.right_of_way_width !== undefined
        ? { label: "Right of way", value: metres(route.right_of_way_width, 1) }
        : null,
    ]),
    section("Longitudinal profile", [
      profile?.horizontal_scale
        ? { label: "Horizontal scale", value: `1:${Number(profile.horizontal_scale).toLocaleString()}` }
        : null,
      profile?.vertical_scale
        ? { label: "Vertical scale", value: `1:${Number(profile.vertical_scale).toLocaleString()}` }
        : null,
      { label: "Station interval", value: metres(profile?.station_interval, 0) },
      { label: "Elevation interval", value: metres(profile?.elevation_interval) },
      { label: "Plan view", value: yesNo(route?.show_plan_view) },
      { label: "Chainage labels", value: yesNo(route?.show_chainage_labels) },
    ]),
  ];
};

/**
 * Every section worth showing for this plan, in reading order.
 *
 * Takes the plan as the API returns it rather than a page's own mapped shape,
 * so a field that exists on the plan can be shown without a page having to
 * thread it through first -- which is how the layout and route sections came
 * to be missing.
 */
export function planSummary(plan: any): SummarySection[] {
  if (!plan || plan.computation_only) return [];

  const byType: Record<string, (p: any) => (SummarySection | null)[]> = {
    cadastral: cadastralSections,
    topographic: topographicSections,
    layout: layoutSections,
    route: routeSections,
  };

  return [
    surveySection(plan),
    ...(byType[plan.type as string]?.(plan) ?? []),
    sheetSection(plan),
  ].filter((s): s is SummarySection => s !== null);
}
