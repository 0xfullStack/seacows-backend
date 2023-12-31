import { gql } from "graphql-request";
import { graphql } from "./client";
import { SupportedChain } from "src/env";

export interface PoolInput {
  chain: SupportedChain;
  id?: string;
  first?: number;
  skip?: number;
}

export interface Pool {
  id: string;
  timestamp: string;
}

export const getPools = async ({ chain }: PoolInput, requestHeaders?: HeadersInit): Promise<Pool[]> => {
  const query = gql`
    query GetPools {
      pools {
        id
        timestamp
      }
    }
  `;
  const res = await graphql<{ pools: Pool[] }>(chain, query, {}, requestHeaders);
  return res.pools || [];
};

export const getPool = async ({ first = 1000, chain, id }: PoolInput, requestHeaders?: HeadersInit): Promise<Pool> => {
  const query = gql`
    query GetPool($id: ID!, $first: Int) {
      pool(id: $id) {
        id
        timestamp
        liquidity
        price
        createdAt
        totalValueLocked
        totalFee
        poolWeekData(orderBy: week, orderDirection: desc, first: 1) {
          price
          priceChange
          volume
          week
        }
        poolDayData(orderBy: date, orderDirection: desc, first: 1) {
          price
          priceChange
          volume
          date
        }
        collection {
          name
          id
        }
        token {
          id
          name
        }
        nfts(first: $first) {
          ...NFTFragment
        }
      }
    }
    fragment NFTFragment on NFT {
      id
      tokenId
    }
  `;

  const res = await graphql<{ pool: Pool }>(
    chain,
    query,
    {
      id,
      first,
    },
    requestHeaders
  );
  return res.pool;
};
