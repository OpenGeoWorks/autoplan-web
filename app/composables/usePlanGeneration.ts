import axios from "axios";

/**
 * Generating a plan, whether it runs inline or as a background job (Task 12).
 *
 * A small plan comes back with a URL in the response, as it always did. A large
 * one answers 202 with a job id: the work can run for minutes, so the request
 * returns immediately and this polls for progress until the plan is ready.
 *
 * Callers see one promise and a reactive progress object either way — the size
 * of the survey should not change how the screen is written.
 */

export interface PlanJob {
  id: string;
  status: "queued" | "running" | "done" | "failed";
  stage: string;
  processed: number;
  total: number;
  percent: number;
  url?: string;
  error?: string;
  point_count?: number;
}

export interface GenerationProgress {
  /** True while a background job is being followed. */
  background: boolean;
  percent: number;
  stage: string;
  processed: number;
  total: number;
}

/** How often to ask for progress. Frequent enough to feel live, rare enough
 *  that a long job is not thousands of requests. */
const POLL_INTERVAL_MS = 1500;

/** Give up if a job stops changing for this long — a worker that died would
 *  otherwise leave the screen spinning forever. */
const STALL_TIMEOUT_MS = 5 * 60 * 1000;

export const emptyProgress = (): GenerationProgress => ({
  background: false,
  percent: 0,
  stage: "",
  processed: 0,
  total: 0,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a plan and resolve with its download URL.
 *
 * `onProgress` is called as the job advances; for an inline generation it is
 * never called, because there are no intermediate states to report.
 */
export async function generatePlan(
  planId: string,
  onProgress?: (progress: GenerationProgress) => void,
): Promise<string> {
  const response = await axios.get(`/plan/generate/${planId}`, {
    // 202 means queued, which axios must not treat as a failure.
    validateStatus: (status) => status === 200 || status === 202,
  });

  const data = response.data?.data;

  if (data?.url) return data.url as string;

  const job = data?.job as PlanJob | undefined;
  if (!job?.id) throw new Error("The server did not return a plan or a job");

  return followJob(job.id, onProgress);
}

/** Poll a job until it finishes, reporting progress along the way. */
export async function followJob(
  jobId: string,
  onProgress?: (progress: GenerationProgress) => void,
): Promise<string> {
  let lastChange = Date.now();
  let lastSignature = "";

  for (;;) {
    const { data } = await axios.get(`/plan/job/${jobId}`);
    const job = data?.data as PlanJob;

    if (!job) throw new Error("The generation job could not be found");

    onProgress?.({
      background: true,
      percent: job.percent ?? 0,
      stage: job.stage ?? "",
      processed: job.processed ?? 0,
      total: job.total ?? 0,
    });

    if (job.status === "done") {
      if (!job.url) throw new Error("The job finished without producing a plan");
      return job.url;
    }

    if (job.status === "failed") {
      throw new Error(job.error || "The plan could not be generated");
    }

    // Watch for a job that has stopped moving rather than one that is slow.
    const signature = `${job.status}:${job.stage}:${job.percent}:${job.processed}`;
    if (signature !== lastSignature) {
      lastSignature = signature;
      lastChange = Date.now();
    } else if (Date.now() - lastChange > STALL_TIMEOUT_MS) {
      throw new Error(
        "The plan is taking longer than expected and has stopped reporting progress.",
      );
    }

    await sleep(POLL_INTERVAL_MS);
  }
}

/** "exporting points — 450,000 of 1,000,000" */
export const describeProgress = (progress: GenerationProgress): string => {
  if (!progress.stage) return "Generating…";
  if (progress.total > 0 && progress.processed > 0) {
    return `${progress.stage} — ${progress.processed.toLocaleString()} of ${progress.total.toLocaleString()}`;
  }
  return progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1);
};

/**
 * Ask for a link to this plan's last drawing.
 *
 * The archive is private and no link to it is stored, so one is minted on
 * request for whoever owns the plan and stops working shortly afterwards.
 * That is why this is a call rather than a URL held in the page: a link kept
 * around would either be dead or, worse, still live.
 */
export async function getPlanDownloadUrl(planId: string): Promise<string> {
  const { data } = await axios.get(`/plan/download/${planId}`);
  const url = data?.data?.url;
  if (!url) throw new Error("No generated plan is available to download");
  return url;
}
