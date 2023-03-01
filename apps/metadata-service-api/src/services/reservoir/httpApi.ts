import type { ReservoirHttpClient } from "./shared";
import type { ReservoirToken } from "../../schemas/reservoir";
import { ReservoirCollectionResponse, ReservoirTokenResponse } from "../../schemas/reservoir";
import logger from "../../utils/logger";
import { ReservoirConfig } from "../../utils/constants";

type TokenSortBy = "tokenId" | "floorAskPrice" | "rarity";

export class ReservoirHttpApi {
  private readonly logger = logger.childLogger("ReservoirHttpApi");

  constructor(private readonly ReservoirHttpClient: ReservoirHttpClient) {}

  async requestCollections(collectionId: string): Promise<ReservoirCollectionResponse> {
    const data = await this.ReservoirHttpClient.makeRequest("collections/v5", {
      searchParams: {
        id: collectionId
      },
    });
    
    return ReservoirCollectionResponse.parse(data);
  }

  private async requestCollectionTokens(collectionId: string, sortBy: TokenSortBy = "tokenId", continutation?: string): Promise<ReservoirTokenResponse> {
    const data = await this.ReservoirHttpClient.makeRequest("tokens/v5", {
      searchParams: {
        collection: collectionId,
        sortBy,
        limit: 100,
        // Use continuation token to request next offset of items
        continutation
      },
    });

    return ReservoirTokenResponse.parse(data);
  }

  /**
   * Fetch tokens for a given collection through paginated API calls. Calls are done recursively
   */
  async requestMaxTokens(collectionId: string, continuation?: string): Promise<ReservoirToken[]> {
    const { continuation: continueToken, tokens } = await this.requestCollectionTokens(collectionId, "tokenId", continuation);

    console.count('requestMaxTokens: ' + collectionId );
    console.log('nextTokens', tokens.length);

    if (continueToken) {
      this.logger.debug("Requesting next tokens.", { continuation: continueToken });
      const nextTokens = await this.requestMaxTokens(collectionId, continueToken);

      
      return tokens.map(t => t.token).concat(nextTokens);
    } else {
      return tokens.map(t => t.token);
    }
  }
}
