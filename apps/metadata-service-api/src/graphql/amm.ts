import { gql } from "graphql-request";
import { graphql } from "./client";
import { SupportedChain } from "src/env";

interface PaginatedInput {
  skip?: number;
  first?: number;
}

interface PoolInput extends PaginatedInput {
  chain: SupportedChain;
  where?: {
    collections?: string[];
    collection?: string;
    token?: string;
  };
}

export interface AmmPool {
  id: string;
  collection: {
    id: string;
    name: string;
  };
}

export const getAmmPools = async (
  { skip = 0, first = 1000, chain, where }: PoolInput,
  requestHeaders?: HeadersInit
): Promise<AmmPool[]> => {
  const query = gql`
    query GetAMMPositions($where: Pool_filter, $skip: Int, $first: Int) {
      pools(first: $first, skip: $skip, where: $where) {
        id
        collection {
          id
          name
        }
      }
    }
  `;

  const res = await graphql<{ pools: AmmPool[] }>(
    chain,
    query,
    {
      where: {
        collection_in: where?.collections,
      },
      skip,
      first,
    },
    requestHeaders
  );
  return res.pools;
};

export const getAmmPoolNfts = async (
  { skip = 0, first = 1000, chain, where }: PoolInput,
  requestHeaders?: HeadersInit
): Promise<AmmPool[]> => {
  const query = gql`
    query GetAmmPoolNfts($where: Pool_filter, $skip: Int, $first: Int) {
      pools(first: $first, skip: $skip, where: $where) {
        id
        fee
        slot
        liquidity
        price
        createdAt
        liquidity
        totalValueLocked
        totalFee
        token {
          ...TokenFragment
          __typename
        }
        collection {
          ...CollectionFragment
          __typename
        }
        nfts(first: $first) {
          ...NFTFragment
          __typename
        }
        slot
        __typename
      }
    }
    fragment CollectionFragment on Collection {
      id
      name
      symbol
      __typename
    }

    fragment TokenFragment on Token {
      id
      name
      symbol
      decimals
      __typename
    }

    fragment NFTFragment on NFT {
      id
      tokenId
      __typename
    }
  `;

  const res = await graphql<{ pools: AmmPool[] }>(
    chain,
    query,
    {
      where: {
        collection: where?.collection,
        token: where?.token,
      },
      skip,
      first,
    },
    requestHeaders
  );
  return res.pools;
};

export const getPoolsData = async (
  { skip = 0, first = 1000, chain, where }: PoolInput,
  requestHeaders?: HeadersInit
): Promise<AmmPool[]> => {
  const query = gql`
    query getPoolsData($where: Pool_filter, $skip: Int, $first: Int) {
      pools(first: $first, skip: $skip, where: $where) {
        id
        poolWeekData(orderBy: week, orderDirection: desc, first: 1) {
          price
          priceChange
          volume
          week
          __typename
        }
        poolDayData(first: 1, orderBy: date, orderDirection: desc) {
          price
          priceChange
          volume
          date
          __typename
        }
        createdAt
        liquidity
        totalValueLocked
        totalFee
        collection {
          name
          id
          __typename
        }
        token {
          id
          name
          __typename
        }
        slot
        __typename
      }
    }
  `;
  const params: Record<string, any> = { skip, first };
  if (where?.collections) {
    Object.assign(params, {
      where: {
        collection_in: where.collections,
      },
    });
  }

  const res = await graphql<{ pools: AmmPool[] }>(chain, query, params, requestHeaders);
  return res.pools;
};
