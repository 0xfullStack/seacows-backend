import { initApp } from "./app";
import logger from "./utils/logger";
import { AppEnv, getAppEnv } from "./env";

async function main() {
  const port = process.env.PORT || 3001;
  const app = initApp();

  app.listen(port, () => logger.log(`Example app listening at http://localhost:${port}`));

  // // Reservoir APIs
  // const reservoirHttpApi = app.context.external.reservoirApi;

  // const collection = await reservoirHttpApi.requestCollections
  // ("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");

  // // const tokens = await reservoirHttpApi.requestMaxTokens
  // // ("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");

  // console.log(collection);
}

main().catch((error: Error) => {
  logger.fatal("Backend server failed:", { error: error.message });
});
