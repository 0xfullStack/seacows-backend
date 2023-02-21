import { app } from "./app";
import logger from "./utils/logger";
import { ReservoirHttpClientManager } from './services/reservoir/httpClientManager';
import { ReservoirHttpApi } from './services/reservoir/httpApi';

async function main() {
  const port = process.env.PORT || 3000;

  app.listen(port, () =>
    logger.log(`Example app listening at http://localhost:${port}`)
  );

  // Reservoir APIs
  const reservoirHttpClient = new ReservoirHttpClientManager(['795529a5-c76c-5bd1-8bab-03e5d2b4426d', 'd3d8f38b-2ae4-529e-8559-c5ae6870d9f6']);
  const reservoirHttpApi = new ReservoirHttpApi(reservoirHttpClient);

  // const collection = await reservoirHttpApi.requestCollections
  // ("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");

  // const tokens = await reservoirHttpApi.requestMaxTokens
  // ("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");

  // console.log(tokens);
}

main();
