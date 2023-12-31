import { POOLS_UPDATED_EVENT, eventEmitter } from "src/utils/events";
import logger from "src/utils/logger";

import { getPoolQueue } from "./pools";

eventEmitter.on(POOLS_UPDATED_EVENT, async function (chain: string, pools: string[]) {
  const q = getPoolQueue();
  try {
    const jobs = pools.map((pool) => {
      return { name: pool, data: { chain, pool, timestamp: Date.now() } };
    });
    await q.addBulk(jobs);
  } catch (error) {
    logger.error("Failed to add the pools to queue", error as Error);
  }
});
