import { Worker, Job, Queue, QueueEvents } from "bullmq";
import dayjs from "dayjs";
import type { Redis } from "ioredis";
import { SupportedChain, validateChain } from "src/env";
import { POOLS_UPDATED_EVENT, eventEmitter } from "src/utils/events";
import { keeper, pools } from "src/redis";
import { getPools as graphqlGetPools } from "src/graphql/pool";

import logger from "src/utils/logger";
import { name } from "./name";

let worker: Worker;

export interface IJobData {
  chain: SupportedChain;
}

function validateData(data: any) {
  return validateChain(data?.chain);
}

/**
 * Query the latest update time of the pools, push it to the batch update queue
 * the batch update will perform real business logic.
 * @param redis
 */
export async function initKeeperWorker(redis: Redis) {
  const connection = Object.assign(redis.options, { maxRetriesPerRequest: null });
  const opts = { connection };
  worker = new Worker(
    name,
    async (job: Job) => {
      logger.debug(`keeper worker ${job.id} consume at ${new Date().toISOString()}`);
      if (!validateData(job.data)) {
        logger.warn(`job.id ${job.id} has invalid data ${JSON.stringify(job.data)}`);
        return;
      }
      const { chain } = job.data as IJobData;
      const keeperPools = await keeper.getPools(chain);
      if (!Object.keys(keeperPools).length) return;

      const [resolvedPools, onChainPools] = await Promise.all([
        pools.getPools(chain), // resolved pools
        graphqlGetPools({ chain }), // onchain pools
      ]);

      const onchainPoolObj = Object.fromEntries(onChainPools.map((item) => [item.id, dayjs.unix(+item.timestamp)]));
      const activePools = Object.keys(keeperPools).filter((pool) => {
        const resolvedAt = +resolvedPools[pool];
        if (!resolvedAt) return true;

        const onchainUpdatedAt = onchainPoolObj[pool];
        if (!onchainUpdatedAt) return false;

        return dayjs(onchainUpdatedAt).isAfter(dayjs(resolvedAt));
      });

      if (!activePools.length) return;
      eventEmitter.emit(POOLS_UPDATED_EVENT, chain, activePools);
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
