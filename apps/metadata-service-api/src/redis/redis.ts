import Redis from "ioredis";

let redis: Redis;

export function initRedis(url: string) {
  redis = new Redis(url);
  return redis;
}

export function getRedis() {
  if (!redis) throw new Error("redis not init");
  return redis;
}

process.on("SIGALRM", () => {
  if (!redis) return;
  redis.disconnect();
});
