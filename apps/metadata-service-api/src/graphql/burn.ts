import { gql } from "graphql-request";
import { graphql } from "./client";
import { SupportedChain } from "src/env";

export interface PaginatedInput {
  skip?: number;
  first?: number;
}

export interface BurnInput extends PaginatedInput {
  chain: SupportedChain;
  where: {
    collection?: string;
    origin?: string;
  };
}

export interface Burn {
  nftAmount: string;
  origin: string;
  tokenAmount: string;
  token: {
    symbol: string;
  };
  timestamp: string;
  pool: {
    id: string;
    collection: {
      name: string;
      symbol: string;
    };
  };
}

export const getBurns = async (
  { skip = 0, first = 1000, chain, where }: BurnInput,
  requestHeaders?: HeadersInit
): Promise<Burn[]> => {
  const query = gql`
    query GetWithdraw($where: Burn_filter, $skip: Int, $first: Int) {
      burns(where: $where, first: $first, skip: $skip) {
        nftAmount
        id
        origin
        tokenAmount
        timestamp
        collection {
          symbol
          name
          __typename
        }
        token {
          symbol
          __typename
        }
        __typename
      }
    }
  `;

  const res = await graphql<{ burns: Burn[] }>(
    chain,
    query,
    {
      where: {
        collection: where.collection?.toLowerCase(),
        origin: where.origin?.toLowerCase(),
      },
      skip,
      first,
    },
    requestHeaders
  );
  return res.burns;
};
