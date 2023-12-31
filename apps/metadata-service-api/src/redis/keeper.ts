import { getRedis } from "./redis";

export const KEEPER_KEY = "pool_keeper";
export const KEEPER_TTL = 2 * 60 * 60;

function getKeeperKey(chain: string) {
  return `${chain}_${KEEPER_KEY}`;
}

export async function addPools(chain: string, pools: string[]) {
  if (!(Array.isArray(pools) && pools.length)) return;

  const redis = getRedis();
  const key = getKeeperKey(chain);
  const now = Date.now();

  const scoreMembers: (string | number)[] = pools.map((pool) => [now, pool]).flat();
  return redis
    .multi()
    .zadd(key, ...scoreMembers)
    .expire(key, KEEPER_TTL)
    .exec();
}

export async function removePools(chain: string, pools: string[]) {
  if (!(Array.isArray(pools) && pools.length)) return;

  const redis = getRedis();
  const key = getKeeperKey(chain);

  await redis
    .multi()
    .zrem(key, ...pools)
    .expire(key, KEEPER_TTL)
    .exec();
}

export async function getPools(chain: string): Promise<Record<string, number>> {
  const redis = getRedis();
  const key = getKeeperKey(chain);
  const pools: Record<string, number> = {};
  const result = await redis.zrange(key, 0, -1, "WITHSCORES");
  for (let index = 0, length = result.length; index < length; index += 2) {
    const key = result[index];
    const value = result[index + 1];
    pools[key] = +value;
  }
  return pools;
}
