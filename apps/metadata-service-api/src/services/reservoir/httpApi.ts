import type { ReservoirHttpClient } from "./shared";
import type { paths } from "@reservoir0x/reservoir-sdk";
import type { ReservoirToken } from "../../schemas/reservoir";
import { ReservoirCollectionResponse, ReservoirTokenResponse } from "../../schemas/reservoir";
import logger from "../../utils/logger";
import { ReservoirConfig } from "../../utils/constants";

type TokenSortBy = "tokenId" | "floorAskPrice" | "rarity";

type ExploreAttributesResponse =
  paths["/collections/{collection}/attributes/explore/v4"]["get"]["responses"]["200"]["schema"];
type MultipleCollectionsResponse = paths["/collections/v5"]["get"]["responses"]["200"]["schema"];
type UserTokensResponse = paths["/users/{user}/tokens/v6"]["get"]["responses"]["200"]["schema"];
type CollectionAllAttributesResponse =
  paths["/collections/{collection}/attributes/all/v3"]["get"]["responses"]["200"]["schema"];
type SearchCollectionsResponse = paths["/search/collections/v1"]["get"]["responses"]["200"]["schema"];

export class ReservoirHttpApi {
  private readonly logger = logger.childLogger("ReservoirHttpApi");
  constructor(private readonly ReservoirHttpClient: ReservoirHttpClient) {}

  async requestUserTokens(account: string, collection?: string, continuation?: string): Promise<UserTokensResponse> {
    const data = await this.ReservoirHttpClient.makeRequest<UserTokensResponse>(`users/${account}/tokens/v6`, {
      searchParams: {
        collection,
        continuation,
      },
    });

    return data;
  }

  async searchCollections(name: string) {
    // https://docs.reservoir.tools/reference/getsearchcollectionsv1
    const data = await this.ReservoirHttpClient.makeRequest<SearchCollectionsResponse>(`search/collections/v1`, {
      searchParams: {
        name,
        // offset
        // limit (Default 20)
      },
    });

    return data;
  }

  async requestCollections(collectionId: string): Promise<ReservoirCollectionResponse> {
    const data = await this.ReservoirHttpClient.makeRequest("collections/v5", {
      searchParams: {
        id: collectionId,
      },
    });

    return ReservoirCollectionResponse.parse(data);
  }

  async requestCollectionAllAttributes(collection: string): Promise<CollectionAllAttributesResponse> {
    const data = await this.ReservoirHttpClient.makeRequest<CollectionAllAttributesResponse>(
      `collection/${collection}/attributes/all/v3`
    );

    return data;
  }

  async requestMultipleCollections(
    sortBy: "1DayVolume" | "7DayVolume" | "1DayVolume" | "30DayVolume" | "allTimeVolume" | "createdAt",
    limit = 20,
    continuation?: string
  ) {
    const data = await this.ReservoirHttpClient.makeRequest<MultipleCollectionsResponse>("collections/v5", {
      searchParams: {
        sortBy,
        limit,
        continuation,
      },
    });

    return data;
  }

  async requestTokenAttributes(collectionId: string, tokenId: string) {
    const data = await this.ReservoirHttpClient.makeRequest<ExploreAttributesResponse>(
      `collections/${collectionId}/attributes/explore/v4`,
      {
        searchParams: {
          tokenId,
        },
      }
    );

    return data;
  }

  private async requestCollectionTokens(
    collectionId: string,
    sortBy: TokenSortBy = "tokenId",
    continuation?: string
  ): Promise<ReservoirTokenResponse> {
    const data = await this.ReservoirHttpClient.makeRequest("tokens/v5", {
      searchParams: {
        contract: collectionId,
        sortBy,
        limit: 100,
        // Use continuation token to request next offset of items
        continuation,
      },
    });

    return ReservoirTokenResponse.parse(data);
  }

  /**
   * Fetch tokens for a given collection through paginated API calls. Calls are done recursively
   */
  async requestMaxTokens(
    collectionId: string,
    continuation?: string,
    callback?: (tokens: ReservoirTokenResponse["tokens"]) => unknown
  ): Promise<ReservoirToken[]> {
    const { continuation: continueToken, tokens } = await this.requestCollectionTokens(
      collectionId,
      "tokenId",
      continuation
    );

    if (callback) {
      callback(tokens);
    }

    if (continueToken) {
      this.logger.log("Requesting next tokens.", {
        continuation: continueToken,
        collectionId,
        tokens: tokens.length,
      });
      const nextTokens = await this.requestMaxTokens(collectionId, continueToken);

      return tokens.map((t) => t.token).concat(nextTokens);
    } else {
      return tokens.map((t) => t.token);
    }
  }
}
