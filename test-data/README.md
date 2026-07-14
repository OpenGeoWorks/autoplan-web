# Test Datasets

Realistic field-survey simulations for testing all four plan types from the
web app. All coordinates are UTM Zone 31 (Lagos area), in metres. Every file
has been validated end-to-end through the plan generators.

## 1. Cadastral — `cadastral_coordinates.csv`

A ~1.1 ha family land in Ikeja subdivided into **3 parcels** sharing division
beacons. 13 beacons: `SBD 1201`–`SBD 1211` on the perimeter, `SBD 1212` and
`SBD 1213` on the internal division lines.

1. **Coordinate Table** step → Import the CSV.
2. **Parcel Table** step → create three parcels with these beacon ids (in order):

| Parcel | Beacon ids (in order) |
|--------|----------------------|
| Parcel A | SBD 1201, SBD 1202, SBD 1212, SBD 1208, SBD 1209, SBD 1210, SBD 1211 |
| Parcel B | SBD 1202, SBD 1203, SBD 1213, SBD 1207, SBD 1208, SBD 1212 |
| Parcel C | SBD 1203, SBD 1204, SBD 1205, SBD 1206, SBD 1207, SBD 1213 |

3. Run the computation step, then generate.

## 2. Topographic — `topo_boundary.csv` + `topo_spot_heights.csv`

A 4.1 ha site with realistic terrain: a knoll in the north-west (peak ~56 m),
a stream valley running diagonally across the site, and a general fall,
captured as 344 spot heights (42–56 m) on serpentine survey lines with extra
pickup along the stream.

1. **Perimeter Survey** step → import `topo_boundary.csv` (9 beacons, `SAG 07`–`SAG 15`).
2. **Spot Height** step → import `topo_spot_heights.csv`.
3. **Topo Settings**: contour interval **0.5 m**, major contour **2.5 m**,
   TIN surface. The knoll and stream valley should be clearly visible in the
   contours.

## 3. Route — `route_elevations.csv` + `route_stations.csv`

A **2.0 km access road** at 20 m stations (101 stations, `CH0`–`CH100`,
chainage 0+000 to 2+000). Horizontal alignment: tangent → right-hand curve
(R = 400 m) → tangent → left-hand curve (R = 300 m) → tangent, bearing ~42°.
Vertical: two rises (crests near 0+450 and 1+500) with a swampy sag around
1+000; levels 43.6–57.4 m.

1. **Elevation Data** step → import `route_elevations.csv`.
2. **Route Alignment** step → import `route_stations.csv`
   (right of way 30 m, plan view on).
3. **Longitudinal Profile**: station interval **20 m**, vertical scale 5–10
   for a readable exaggeration.

## 4. Layout — `layout_boundary.csv`

An 8.75 ha irregular estate site (10 beacons, `SBL 501`–`SBL 510`).

1. **Site Boundary** step → import the CSV.
2. **Layout Design** step → *Auto-generate subdivision* with the defaults
   (15 × 30 m plots), name the major road, ~10% open space, add a
   `school` facility. Generates ≈127 plots in 8 blocks with a land-use
   schedule.
3. To exercise **draw mode** (*Enter designed layout*), import the three
   companion files — a complete pre-designed 127-plot scheme for the same
   boundary, exported from a real generation run:
   - `layout_corners.csv` → *Plot Corner Coordinates* table (257 points, `LP n` / `RC n`)
   - `layout_plots.csv` → *Plots* table (`Block,Number,Use,Area,Corner_IDs`,
     corner ids separated by `;`)
   - `layout_roads.csv` → *Roads* table (`Name,Width,Centerline_IDs`)
