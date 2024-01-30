import { gql } from "graphql-request";
import { graphql } from "./client";
import { SupportedChain } from "src/env";

export interface PaginatedInput {
  skip?: number;
  first?: number;
}

export interface MintInput extends PaginatedInput {
  chain: SupportedChain;
  where: {
    collection?: string;
  };
}

export interface Mint {
  nftAmount: string;
  tokenAmount: string;
  origin: string;
  timestamp: string;
  id: string;
  token: {
    symbol: string;
  };
  collection: {
    id: string;
    name: string;
    symbol: string;
  };
}

export const getMints = async (
  { skip = 0, first = 1000, chain, where }: MintInput,
  requestHeaders?: HeadersInit
): Promise<Mint[]> => {
  const query = gql`
    query GetMints($where: Mint_filter, $skip: Int, $first: Int) {
      mints(first: $first, skip: $skip, where: $where) {
        nftAmount
        origin
        timestamp
        tokenAmount
        id
        token {
          symbol
          __typename
        }
        collection {
          name
          symbol
          __typename
        }
        __typename
      }
    }
  `;

  const res = await graphql<{ mints: Mint[] }>(
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
  return res.mints;
};
