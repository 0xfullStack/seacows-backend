import { getRedis } from "./redis";

export const RESOLVED_POOLS_KEY = "key_of_pools_task";

function getPoolKey(chain: string) {
  return `${chain}_${RESOLVED_POOLS_KEY}`;
}

export async function getPool(chain: string, pool: string) {
  const redis = getRedis();
  const key = getPoolKey(chain);
  return redis.hget(key, pool);
}

export async function resolvePool(chain: string, pool: string) {
  const now = Date.now();
  const redis = getRedis();
  const key = getPoolKey(chain);

  await redis.hmset(key, [pool, now]);
}

export async function resolvePools(chain: string, pools: string[]) {
  const now = Date.now();
  const redis = getRedis();
  const key = getPoolKey(chain);
  const values: (string | number)[] = pools.map((pool) => [pool, now]).flat();
  await redis.hmset(key, values);
}

export async function getPools(chain: string) {
  const redis = getRedis();
  const key = getPoolKey(chain);
  return await redis.hgetall(key);
}
