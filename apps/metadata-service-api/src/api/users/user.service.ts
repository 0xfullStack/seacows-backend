import external from "src/services";

const getUserTokens = async (account: string, collection?: string, continuation?: string) => {
  return external.reservoirApi.requestUserTokens(account, collection, continuation);
};

export default {
  getUserTokens,
};
