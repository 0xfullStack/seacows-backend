import { getAppEnv } from "src/env";
import { getRedis } from "./redis";

const env = getAppEnv();

export function getTokenKey(chain: string, collectionId: string, tokenId: string) {
  return `token_state_${chain}_${collectionId.toLowerCase()}_${tokenId}`;
}

export async function lockNFT(chain: string, collectionId: string, tokenId: string, userId: string) {
  const redis = getRedis();
  const key = getTokenKey(chain, collectionId, tokenId);
  return await redis.multi().set(key, userId).expire(key, env.STATE_LOCK_EXPIRE).exec();
}

export async function unlockNFT(chain: string, collectionId: string, tokenId: string, userId: string) {
  const redis = getRedis();
  const key = getTokenKey(chain, collectionId, tokenId);
  const value = await redis.get(key);
  if (value !== userId) return false;

  await redis.del(key);
  return true;
}

export async function getNFTLocker(chain: string, collectionId: string, tokenId: string) {
  const redis = getRedis();
  const key = getTokenKey(chain, collectionId, tokenId);
  return await redis.get(key);
}
