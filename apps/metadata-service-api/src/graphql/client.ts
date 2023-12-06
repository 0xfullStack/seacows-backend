import request from "graphql-request";
import { SupportedChain, SupportedSubgraphEndpoint } from "src/env";

/**
 * General wrapper around requests to the api & subgraph to centralize error handling
 *
 * @param query GraphQL query
 * @param params GraphQL params (via the gql function)
 * @param requestHeaders HeadersInit
 * @param url string url to query
 */
export const graphql = async <T>(
  chain: SupportedChain,
  query: string,
  params?: Record<string, any>,
  requestHeaders?: HeadersInit
) => {
  try {
    const endpoint = SupportedSubgraphEndpoint[chain];
    const res = await request<T>(endpoint, query, params, requestHeaders);
    return res;
  } catch (error: any) {
    console.error("GraphQL error", { error });

    // If the API error returned is somewhow different than what we expect
    // throw whatever came back.
    if (!error || !error?.response) {
      throw error;
    }

    throw error.response;
  }
};
