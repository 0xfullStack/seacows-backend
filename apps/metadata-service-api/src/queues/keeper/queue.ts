import { Queue, QueueEvents } from "bullmq";
import type { Redis } from "ioredis";
import logger from "src/utils/logger";
import { name } from "./name";

let queue: Queue;
let queueEvents: QueueEvents;

export function getKeeperQueue() {
  if (!queue) throw new Error("pool queue not init");
  return queue;
}

export async function initKeeperQueue(redis: Redis) {
  const connection = Object.assign(redis.options, { maxRetriesPerRequest: null });

  queue = new Queue(name, { connection });
  queueEvents = new QueueEvents(name, { connection });
  await queue.waitUntilReady();

  queueEvents.on("failed", ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    logger.error(`error ${jobId} ${name}` + failedReason);
  });
}

process.on("SIGALRM", async () => {
  await queue?.close();
});
