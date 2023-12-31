import { Redis } from "ioredis";
import { initKeeperQueue, initKeeperWorker } from "./keeper";
import { initPoolQueue, initPoolWorker } from "./pools";
export { initTasks } from "./tasks";
import "./events";

export * from "./keeper";

export async function initQueues(redis: Redis) {
  await initKeeperQueue(redis);
  await initKeeperWorker(redis);

  await initPoolQueue(redis);
  await initPoolWorker(redis);
}
