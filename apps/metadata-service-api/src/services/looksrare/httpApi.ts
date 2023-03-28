import type { LooksRareHttpClient } from "./shared";
import type { LooksRareToken } from "../../schemas/looksrare";
import { LooksRareCollectionResponse, LooksRareTokenResponse } from "../../schemas/looksrare";
import logger from "../../utils/logger";
import { LooksRareConfig } from "../../utils/constants";

export class LooksRareHttpApi {
  private readonly logger = logger.childLogger("LooksRareHttpApi");
  constructor(private readonly LooksRareHttpClient: LooksRareHttpClient) {}

  async requestCollection(collection: string): Promise<LooksRareCollectionResponse> {
    const data = await this.LooksRareHttpClient.makeRequest("collections", {
      searchParams: {
        address: collection
      }
    });
    
    return LooksRareCollectionResponse.parse(data);
  }

  async requesToken(collection: string, tokenId: string) {
    const data = await this.LooksRareHttpClient.makeRequest("tokens", {
      searchParams: {
        collection,
        tokenId
      },
    });
    
    return LooksRareTokenResponse.parse(data);
  }
}
