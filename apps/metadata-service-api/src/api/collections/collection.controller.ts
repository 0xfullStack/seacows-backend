import { Collection } from "@prisma/client";
import { Body, Controller, Example, Request, Get, Path, Post, Query, Route, SuccessResponse, Queries } from "tsoa";
import { EthAddress } from "../../schemas/common";
import { SearchCollectionName } from "./collection.schema";
import CollectionService from "./collection.service";

@Route("collections")
export class CollectionController extends Controller {
  @Get("search")
  /**
   * Search collections with params like name, etc
   */
  public async searchCollections(@Query() name: string) {
    const queryName = SearchCollectionName.parse(name);

    return await CollectionService.searchCollections(queryName);
  }

  @Get("trending")
  /**
   * Get 12 trending collections
   */
  public async getTrendingCollections() {
    return await CollectionService.getTrendingCollections();
  }

  /**
   * Get specific collection with address
   * @example collectionId "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258"
   * @returns
   */
  @Get("{collectionId}")
  public async getCollection(@Path() collectionId: string) {
    const collection = EthAddress.parse(collectionId);
    return {
      collection: await CollectionService.getCollection(collection),
    };
  }

  /**
   * Get all tokens of specific collection witha address
   * @example collectionId "0x0c2E57EFddbA8c768147D1fdF9176a0A6EBd5d83"
   * @returns
   */
  @Get("{collectionId}/tokens")
  public async getCollectionTokens(
    @Path() collectionId: string
    // @Queries() queries: Record<string, any>
  ): Promise<any> {
    const collection = EthAddress.parse(collectionId);

    const tokens = await CollectionService.getCollectionTokens(collection);
    return {
      tokens,
    };
  }
}
