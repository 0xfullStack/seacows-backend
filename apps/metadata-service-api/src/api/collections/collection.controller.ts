import { Collection } from "@prisma/client";
import {
  Body,
  Controller,
  Example,
  Request,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  Queries,
} from "tsoa";
import { EthAddress } from "../../schemas/common";
import { SearchCollectionName } from "./collection.schema";
import CollectionService from "./collection.service";

@Route("collections")
export class CollectionController extends Controller {
  @Get("")
  public async searchCollectionByName(@Query() name: string) {
    const queryName = SearchCollectionName.parse(name);

    return await CollectionService.searchCollections(queryName);
  }
  /**
   *
   * @example collectionId "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258"
   * @returns
   */
  @Get("{collectionId}")
  // @Example<Collection>({})
  public async getCollection(@Path() collectionId: string) {
    const collection = EthAddress.parse(collectionId);
    return {
      collection: await CollectionService.getCollection(collection),
    };
  }

  /**
   *
   * @example collectionId "0x0c2E57EFddbA8c768147D1fdF9176a0A6EBd5d83"
   * @returns
   */
  @Get("{collectionId}/tokens")
  // @Example<Collection>({})
  public async getCollectionTokens(
    @Path() collectionId: string
    // @Queries() queries: Record<string, any>
  ): Promise<any> {
    const collection = EthAddress.parse(collectionId);

    await CollectionService.getCollectionTokens(collection);
    return {
      collection: null,
    };
  }
}
