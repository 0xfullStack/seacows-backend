import logger from "src/utils/logger";
import { getKeeperQueue } from "./keeper";

export async function initTasks(chains: string[], cronPattern?: string) {
  const req = chains.map((chain) => initChainTasks(chain, cronPattern));
  await Promise.all(req);
}

function getChainJobId(chain: string) {
  return chain + "amm_pools_task";
}

function getChainJodName(chain: string) {
  return chain + "init_amm_pools_task";
}

/**
 * Initialize pool tasks with corn time. eg: Repeat job once every minute
 * doc: https://docs.bullmq.io/guide/jobs/repeatable
 * @returns
 */
export async function initChainTasks(chain: string, cronPattern?: string) {
  const q = getKeeperQueue();
  const jobId = getChainJobId(chain);
  const name = getChainJodName(chain);
  const job = await q.getJob(jobId);
  if (job) return;
  // if (job) await job.remove({ removeChildren: true });

  const data = { chain, date: Date.now() };
  const opt = { jobId, repeat: { pattern: cronPattern || "*/5 * * * * *" } };
  try {
    await q.add(name, data, opt);
  } catch (error) {
    logger.error(`Failed to init repeat pool task`, error as Error);
    process.exit(1);
  }
}
