import { gql } from "graphql-request";
import { graphql } from "./client";
import { SupportedChain } from "src/env";

interface PaginatedInput {
  skip?: number;
  first?: number;
}

interface SwapInput extends PaginatedInput {
  chain: SupportedChain;
  where: {
    collection?: string;
  };
}

export interface Swap {
  nftAmount: string;
  tokenAmount: string;
  token: {
    id: string;
    symbol: string;
  };
  origin: string;
  timestamp: string;
  pool: {
    id: string;
    collection: {
      id: string;
      name: string;
      symbol: string;
    };
  };
}

export const getSwaps = async (
  { skip = 0, first = 1000, chain, where }: SwapInput,
  requestHeaders?: HeadersInit
): Promise<Swap[]> => {
  const query = gql`
    query GetSwaps($where: Swap_filter, $skip: Int, $first: Int) {
      swaps(first: $first, skip: $skip, where: $where) {
        nftAmount
        tokenAmount
        token {
          id
          symbol
          __typename
        }
        origin
        timestamp
        pool {
          id
          collection {
            id
            name
            symbol
            __typename
          }
          __typename
        }
        id
        __typename
      }
    }
  `;

  const res = await graphql<{ swaps: Swap[] }>(
    chain,
    query,
    {
      where: {
        collection: where.collection,
      },
      skip,
      first,
    },
    requestHeaders
  );
  return res.swaps;
};
