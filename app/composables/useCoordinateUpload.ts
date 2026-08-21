import axios from "axios";
import { followJob, type GenerationProgress } from "~/composables/usePlanGeneration";

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
 * A large file is queued rather than parsed inside the request, so this
 * follows the job and reports progress the same way generation does.
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

/**
 * Send a file to be parsed and stored, following the job if one is returned.
 *
 * `onProgress` is called while a queued upload runs, so the screen can show
 * something moving instead of appearing to hang for a minute.
 */
export async function uploadCoordinateFile(
  planId: string,
  file: File,
  options: {
    mapping?: unknown;
    kind?: "coordinates" | "boundary";
    onProgress?: (progress: GenerationProgress) => void;
  } = {},
): Promise<UploadOutcome> {
  const params = new URLSearchParams({ file_name: file.name });
  if (options.mapping) params.set("mapping", JSON.stringify(options.mapping));
  if (options.kind) params.set("kind", options.kind);

  options.onProgress?.({
    background: true,
    percent: 0,
    stage: "uploading the file",
    processed: 0,
    total: 0,
  });

  const response = await axios.post(
    `/plan/coordinates/upload/${planId}?${params.toString()}`,
    // The body is the file itself. The browser streams it; nothing here ever
    // builds an array of rows.
    file,
    {
      headers: { "Content-Type": "application/octet-stream" },
      // 202 means queued, which axios must not treat as a failure.
      validateStatus: (status) => status === 200 || status === 202,
    },
  );

  const data = response.data?.data;

  // Queued: the survey is parsed by a worker and we follow the job.
  if (data?.job?.id) {
    await followJob(data.job.id, options.onProgress);
    const { data: refreshed } = await axios.get(`/plan/fetch/${planId}`);
    const plan = refreshed?.data;
    return {
      preview: plan?.coordinates ?? [],
      pointCount: plan?.point_count ?? 0,
      skipped: plan?.point_source?.skipped_rows ?? 0,
    };
  }

  // Small enough to have been parsed in the request.
  return {
    preview: data?.coordinates ?? [],
    pointCount: data?.point_count ?? 0,
    skipped: data?.point_source?.skipped_rows ?? 0,
  };
}
