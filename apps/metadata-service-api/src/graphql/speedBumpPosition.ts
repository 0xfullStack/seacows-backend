import { gql } from "graphql-request";
import { graphql } from "./client";
import { SupportedChain } from "src/env";

export interface SpeedBumpPositionInput {
  chain: SupportedChain;
  id: string;
}

export interface SpeedBumpPosition {
  id: string;
  value: string;
  token: {
    id: string;
  }[];
  collections: {
    id: string;
    tokenIds: {
      id: string;
      tokenId?: string;
    }[];
  }[];
}

export const getSpeedBumpPosition = async (
  { chain, id }: SpeedBumpPositionInput,
  requestHeaders?: HeadersInit
): Promise<SpeedBumpPosition> => {
  const query = gql`
    query GetSpeedBumpPosition($id: ID!) {
      speedBumpPosition(id: $id) {
        id
        value
        tokens {
          id
          __typename
        }
        collections {
          id
          tokenIds {
            id
            tokenId
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `;
  const res = await graphql<{ speedBumpPosition: SpeedBumpPosition }>(
    chain,
    query,
    {
      id,
    },
    requestHeaders
  );
  return res.speedBumpPosition;
};
