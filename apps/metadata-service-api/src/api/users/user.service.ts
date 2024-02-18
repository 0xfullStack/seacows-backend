import { SupportedChain } from "src/env";
import external from "src/services";

const getUserTokens = async (
  chain: SupportedChain,
  account: string,
  collection?: string,
  continuation?: string,
  limit?: number
) => {
  return external.reservoirApi.requestUserTokens(chain, account, collection, continuation, limit);
};

const getUserCollections = async (chain: SupportedChain, account: string, collection?: string, name?: string) => {
  return external.reservoirApi.requestUserCollections(chain, account, collection, name);
};

export default {
  getUserTokens,
  getUserCollections,
};
