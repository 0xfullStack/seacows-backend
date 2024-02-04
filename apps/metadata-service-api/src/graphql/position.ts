import { gql } from "graphql-request";
import { graphql } from "./client";
import { SupportedChain } from "src/env";

export interface PaginatedInput {
  skip?: number;
  first?: number;
}

export interface PoolInput extends PaginatedInput {
  chain: SupportedChain;
  where: {
    owner: string;
    slots?: string[];
  };
}

export interface Position {
  id: string;
  liquidity: string;
  slot: string;
  pool: {
    collection: {
      id: string;
      name: string;
      symbol: string;
    };
    token: {
      id: string;
      name: string;
      symbol: string;
      decimals: string;
    };
    nfts: {
      id: string;
      tokenId: string;
    }[];
  };
}

export const getAMMPositions = async (
  { skip = 0, first = 1000, chain, where }: PoolInput,
  requestHeaders?: HeadersInit
): Promise<Position[]> => {
  const query = gql`
    query GetAMMPositions($where: Position_filter, $skip: Int, $first: Int) {
      positions(first: $first, skip: $skip, where: $where) {
        id
        liquidity
        slot
        pool {
          id
          fee
          collection {
            ...CollectionFragment
            __typename
          }
          token {
            ...TokenFragment
            __typename
          }
          nfts(first: $first) {
            ...NFTFragment
            __typename
          }
          __typename
        }
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
  const res = await graphql<{ positions: Position[] }>(
    chain,
    query,
    {
      where: {
        owner: where.owner,
        slot_in: where.slots,
      },
      skip,
      first,
    },
    requestHeaders
  );
  return res.positions;
};

export const getTotalAMMPositions = async (
  { chain, where }: PoolInput,
  requestHeaders?: HeadersInit
): Promise<number> => {
  const query = gql`
    query GetTotalAMMPositions($where: Position_filter) {
      positions(where: $where) {
        id
      }
    }
  `;
  const res = await graphql<{ positions: Position[] }>(
    chain,
    query,
    {
      where: {
        owner: where.owner,
        slot_in: where.slots,
      },
    },
    requestHeaders
  );
  return res.positions.length;
};

export const getOwnerPositions = async (
  { skip = 0, first = 1000, chain, where }: PoolInput,
  requestHeaders?: HeadersInit
): Promise<Position[]> => {
  const query = gql`
    query getOwnerPositions($where: Position_filter) {
      positions(where: $where) {
        id
        liquidity
        owner {
          id
          __typename
        }
        pool {
          liquidity
          totalValueLocked
          __typename
        }
        __typename
      }
    }
  `;
  const res = await graphql<{ positions: Position[] }>(
    chain,
    query,
    {
      where: {
        owner: where.owner,
        slot_in: where.slots,
      },
      skip,
      first,
    },
    requestHeaders
  );
  return res.positions;
};

export const getTotalOwnerPositions = async (
  { chain, where }: PoolInput,
  requestHeaders?: HeadersInit
): Promise<number> => {
  const query = gql`
    query getOwnerPositions($where: Position_filter) {
      positions(where: $where) {
        id
      }
    }
  `;
  const res = await graphql<{ positions: Position[] }>(
    chain,
    query,
    {
      where: {
        owner: where.owner,
        slot_in: where.slots,
      },
    },
    requestHeaders
  );
  return res.positions.length;
};
