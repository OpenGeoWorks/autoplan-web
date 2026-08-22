import axios from "axios";

/**
 * Uploading a coordinate file (Task 12).
 *
 * Two rules shape this, and both exist because a survey can be millions of
 * points:
 *
 *   * the file is never read in the browser. It is handed to the server as the
 *     request body and parsed there;
 *   * nothing but a preview ever comes back. Not after the upload, and not
 *     when the user is choosing which column is which — the mapping dialog
 *     works from a sample of rows the server returns, and the column indices
 *     it produces are applied to the whole file server-side.
 *
 * The upload itself is one request. Queueing it behind a worker was built and
 * measured: it returned in a second, but the table cannot be drawn until the
 * survey is stored, so the user waited just as long -- through a polling loop,
 * with a worker in between that could fail on its own.
 */

/** How much of the file to send for a column preview. Enough to judge the
 *  columns by; nowhere near enough to be a way of uploading a survey. */
const PREVIEW_BYTES = 64 * 1024;

export interface ColumnPreview {
  delimiter: string;
  hasHeader: boolean;
  mapping: {
    id: number | null;
    northing: number | null;
    easting: number | null;
    elevation: number | null;
  };
  headers: string[];
  sampleRows: string[][];
}

/** Ask the server how a file is laid out, from its first few kilobytes. */
export async function previewColumns(file: File): Promise<ColumnPreview> {
  const head = file.slice(0, PREVIEW_BYTES);
  const { data } = await axios.post("/plan/coordinates/preview", head, {
    headers: { "Content-Type": "application/octet-stream" },
  });
  return data?.data as ColumnPreview;
}

export interface UploadOutcome {
  /** Preview rows for the table; never the whole survey. */
  preview: Array<{ id?: string; northing: number; easting: number }>;
  pointCount: number;
  skipped: number;
}

/** What the screen should be showing while an upload runs. */
export interface UploadProgress {
  /** "sending" while bytes leave the browser, "storing" while the server works. */
  phase: "sending" | "storing";
  /** 0-100 while sending; meaningless once the server has the file. */
  percent: number;
  label: string;
}

/**
 * Send a file to be parsed and stored, reporting progress throughout.
 *
 * The upload is a single request: the server parses and stores the survey
 * before it answers. That is a real wait on a large file -- roughly a minute
 * for a million and a half points -- which is why `onProgress` exists. The
 * browser knows exactly how many bytes it has sent, so that half is a real
 * percentage; once the file is delivered the server is working and there is
 * nothing to count, so the screen says so rather than showing a bar that has
 * stopped moving.
 */
export async function uploadCoordinateFile(
  planId: string,
  file: File,
  options: {
    mapping?: unknown;
    kind?: "coordinates" | "boundary";
    onProgress?: (progress: UploadProgress) => void;
  } = {},
): Promise<UploadOutcome> {
  const params = new URLSearchParams({ file_name: file.name });
  if (options.mapping) params.set("mapping", JSON.stringify(options.mapping));
  if (options.kind) params.set("kind", options.kind);

  const report = options.onProgress ?? (() => undefined);
  report({ phase: "sending", percent: 0, label: "Uploading the file…" });

  const { data } = await axios.post(
    `/plan/coordinates/upload/${planId}?${params.toString()}`,
    // The body is the file itself. The browser streams it from disk; nothing
    // here ever reads it into memory or builds an array of rows.
    file,
    {
      headers: { "Content-Type": "application/octet-stream" },
      // A large survey takes the server a while to store, and the default
      // would abandon a request that is working perfectly well.
      timeout: 0,
      onUploadProgress: (event) => {
        const total = event.total ?? file.size;
        const percent = total ? Math.min(100, Math.round((event.loaded / total) * 100)) : 0;
        report(
          percent >= 100
            ? {
                phase: "storing",
                percent: 100,
                label: "Reading and storing the survey…",
              }
            : {
                phase: "sending",
                percent,
                label: `Uploading the file… ${percent}%`,
              },
        );
      },
    },
  );

  const plan = data?.data;
  return {
    // Only ever the preview. The survey stays in the point store.
    preview: plan?.coordinates ?? [],
    pointCount: plan?.point_count ?? 0,
    skipped: plan?.point_source?.skipped_rows ?? 0,
  };
}

/**
 * Apply a different column arrangement to a survey already uploaded.
 *
 * Only the column indices go up. The server re-reads the file it still has
 * and replaces the point store, so a survey of any size can be
 * re-interpreted without a single coordinate crossing the wire in either
 * direction — which is what made the browser fall over.
 */
export async function remapColumns(
  planId: string,
  mapping: Record<string, number | null>,
  kind?: "coordinates" | "boundary",
): Promise<UploadOutcome> {
  const { data } = await axios.post(`/plan/coordinates/remap/${planId}`, {
    mapping,
    kind,
  });
  const plan = data?.data;
  return {
    preview: plan?.coordinates ?? [],
    pointCount: plan?.point_count ?? 0,
    skipped: plan?.point_source?.skipped_rows ?? 0,
  };
}

/**
 * Discard an uploaded survey, returning the plan to a table.
 *
 * Uploaded coordinates cannot be edited row by row, so without this an upload
 * is a one-way door: a file chosen by mistake could only be replaced by
 * another file, never simply removed.
 */
export async function clearUploadedCoordinates(
  planId: string,
  kind?: "coordinates" | "boundary",
): Promise<void> {
  const params = kind ? `?kind=${kind}` : "";
  await axios.delete(`/plan/coordinates/uploaded/${planId}${params}`);
}
