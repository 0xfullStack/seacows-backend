import { initApp } from "./app";
import logger from "./utils/logger";
import { getAppEnv } from "./env";
import { initMoralis } from "./services/moralis";

async function main() {
  const port = process.env.PORT || 3001;
  const env = getAppEnv();
  await initMoralis(env.MORALIS_API_KEY);

  const app = initApp();
  app.listen(port, () => logger.log(`Example app listening at http://localhost:${port}`));
}

main().catch((error: Error) => {
  logger.fatal("Backend server failed:", { error: error.message });
});
