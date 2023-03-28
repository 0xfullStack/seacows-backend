import external from "src/services";
import env from "src/env";
import { QueryTokensArgs } from "./token.schema";

const queryTokensWithMoralis = async (args: QueryTokensArgs) => {
  const response = await external.moralisNftApi.searchNFTs({
    chain: env.CHAIN_ID,
    format: "decimal",
    addresses: [],
    ...args,
  });

  return response.raw;
};

export default {
  queryTokensWithMoralis,
};
