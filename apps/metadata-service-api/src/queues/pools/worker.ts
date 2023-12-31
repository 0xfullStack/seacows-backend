import { Worker, Job } from "bullmq";
import dayjs from "dayjs";
import type { Redis } from "ioredis";

import { SupportedChain, validateChain } from "src/env";
import { pools } from "src/redis";

import logger from "src/utils/logger";
import { POOL_UPDATED_EVENT, eventEmitter } from "src/utils/events";
import { getPool } from "src/graphql/pool";
import { name } from "./name";

let worker: Worker;

export interface IJobData {
  timestamp: number;
  pool: string;
  chain: SupportedChain;
}

function validateData(data: any) {
  if (!data?.timestamp || !data?.pool) return false;
  return validateChain(data?.chain);
}

/**
 * Query the latest update time of the pool, push it to user
 * @param redis
 */
export async function initPoolWorker(redis: Redis) {
  const connection = Object.assign(redis.options, { maxRetriesPerRequest: null });
  const opts = { connection };
  worker = new Worker(
    name,
    async (job: Job) => {
      logger.debug(`consume the pools job ${job.id} at ${new Date().toISOString()}`);
      if (!validateData(job.data)) {
        logger.warn(`job.id ${job.id} has invalid data ${JSON.stringify(job.data)}`);
        return;
      }
      const { chain, pool: id, timestamp } = job.data as IJobData;
      const resolvedAt = await pools.getPool(chain, id);
      if (resolvedAt && dayjs(+resolvedAt).isAfter(timestamp)) return; // already consumed

      const pool = await getPool({ chain, id });
      await pools.resolvePool(chain, id);

      if (!pool || (resolvedAt && dayjs(+resolvedAt).isAfter(dayjs.unix(+pool.timestamp)))) return;

      // see the on(POOL_UPDATED_EVENT, function (room: string, pool: Pool) logic, its will push the pool to the room
      eventEmitter.emit(POOL_UPDATED_EVENT, chain, id, pool);
    },
    opts
  );

  worker.on("failed", (job?: Job, error?: Error) => {
    logger.error(`failed to handle the message ${job?.id} ${error?.message}`, error);
  });

  worker.on("error", (error: Error) => {
    logger.error(`worker error ${error.message || error}`);
  });
}

process.on("SIGALRM", async () => {
  await worker?.close();
});
