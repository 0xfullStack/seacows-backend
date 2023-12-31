import { SUBSCRIBE_POOLS_EVENT, UNSUBSCRIBE_POOLS_EVENT, eventEmitter } from "src/utils/events";
import { keeper } from "src/redis";
import logger from "src/utils/logger";
import { SupportedChain } from "src/env";

eventEmitter.on(SUBSCRIBE_POOLS_EVENT, async (chain: SupportedChain, pools: string[]) => {
  if (!(Array.isArray(pools) && pools.length)) return;
  try {
    await keeper.addPools(chain, pools);
  } catch (error) {
    logger.error(`Failed subscribe pools`, error as Error);
  }
});

eventEmitter.on(UNSUBSCRIBE_POOLS_EVENT, async (chain: SupportedChain, pools: string[]) => {
  if (!(Array.isArray(pools) && pools.length)) return;
  try {
    await keeper.removePools(chain, pools);
  } catch (error) {
    logger.error(`Failed unsubscribe pools`, error as Error);
  }
});
