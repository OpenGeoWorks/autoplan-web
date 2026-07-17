// leaflet-rotate ships no types; it augments L.Map at runtime (side-effect
// import). We call the added map methods (setBearing/getBearing) through
// loosely-typed refs, so an ambient module declaration is all that's needed.
declare module "leaflet-rotate";
