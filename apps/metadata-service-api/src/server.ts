import { createServer } from "node:http";
import { initApp } from "./app";
import logger from "./utils/logger";
import { getAppEnv } from "./env";
import { initMoralis } from "./services/moralis";
import { initRedis } from "./redis";
import { initQueues, initTasks } from "./queues";
import { initWs } from "./ws";

async function main() {
  const port = process.env.PORT || 3001;
  const env = getAppEnv();
  await initMoralis(env.MORALIS_API_KEY);

  const redis = initRedis(env.REDIS_URL);
  await initQueues(redis);
  await initTasks(env.CHAINS, env.CRON_PATTERN);

  const app = initApp(env.SENTRY_DSN);
  const server = createServer(app);
  initWs(server, redis);

  server.listen(port, () => logger.log(`Example app listening at http://localhost:${port}`));
}

main().catch((error: Error) => {
  logger.fatal("Backend server failed:", { error: error.message, stack: error.stack });
});
