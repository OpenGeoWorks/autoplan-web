/**
 * Drag-to-reorder for a data table's columns.
 *
 * This moves a column's *position*. It does not touch the mapping that decides
 * which uploaded column feeds which field — those are separate ideas, and
 * conflating them is how a heading ends up over the wrong values. A table
 * whose <th> and <td> both loop over the same `columns` list moves its
 * headings and its data together for free, because each cell reads
 * `row[col.key]`.
 *
 * The chosen order is remembered per table so a surveyor who wants northing
 * before easting says so once, rather than on every upload.
 */
import { ref, type Ref } from "vue";
import type { FieldDef } from "~/utils/columnMapping";

const STORAGE_KEY = "autoplan.columnOrder";

type OrderStore = Record<string, string[]>;

function readStore(): OrderStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrderStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: OrderStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage failures — the order still applies for this session.
  }
}

/**
 * Apply a remembered order to a field list. Fields the stored order doesn't
 * mention keep their declared position at the end, so adding a field later
 * doesn't strand it.
 */
export function applyStoredOrder(
  tableId: string,
  fields: FieldDef[],
): FieldDef[] {
  const stored = readStore()[tableId];
  if (!stored?.length) return [...fields];

  const byKey = new Map(fields.map((f) => [f.key, f]));
  const ordered: FieldDef[] = [];
  for (const key of stored) {
    const field = byKey.get(key);
    if (field) {
      ordered.push(field);
      byKey.delete(key);
    }
  }
  return [...ordered, ...byKey.values()];
}

export function useColumnOrder(tableId: string, columns: Ref<FieldDef[]>) {
  const dragKey = ref<string | null>(null);
  const overKey = ref<string | null>(null);

  function persist(): void {
    const store = readStore();
    store[tableId] = columns.value.map((c) => c.key);
    writeStore(store);
  }

  /** Replace the order wholesale (e.g. from the mapper) and remember it. */
  function setOrder(next: FieldDef[]): void {
    columns.value = next;
    persist();
  }

  function onHeaderDragStart(key: string): void {
    dragKey.value = key;
  }

  function onHeaderDragOver(key: string): void {
    if (dragKey.value && dragKey.value !== key) overKey.value = key;
  }

  /** Move the dragged column to the dropped-on column's position. */
  function onHeaderDrop(key: string): void {
    const from = columns.value.findIndex((c) => c.key === dragKey.value);
    const to = columns.value.findIndex((c) => c.key === key);
    dragKey.value = null;
    overKey.value = null;
    if (from === -1 || to === -1 || from === to) return;

    const next = [...columns.value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    columns.value = next;
    persist();
  }

  function onHeaderDragEnd(): void {
    dragKey.value = null;
    overKey.value = null;
  }

  return {
    setOrder,
    dragKey,
    overKey,
    onHeaderDragStart,
    onHeaderDragOver,
    onHeaderDrop,
    onHeaderDragEnd,
  };
}
