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
  Tags,
  OperationId,
} from "tsoa";
import { EthAddress, TokenIds } from "../../schemas/common";
import { SearchCollectionName } from "./collection.schema";
import CollectionService from "./collection.service";
import { SupportedChain } from "src/env";
import { BaseController } from "../baseController";

@Route(":chain/collections")
@Tags("collection")
export class CollectionController extends BaseController {
  @Get("search")
  /**
   * Search collections with params like name, etc
   */
  public async searchCollections(@Path("chain") chain: SupportedChain, @Query() name: string) {
    this.validateChain(chain);

    const queryName = SearchCollectionName.parse(name);

    return await CollectionService.searchCollections(chain, queryName);
  }

  @Get("trending")
  /**
   * Get 12 trending collections
   */
  public async getTrendingCollections(@Path("chain") chain: SupportedChain) {
    this.validateChain(chain);

    return await CollectionService.getTrendingCollections(chain);
  }

  /**
   * Get specific collection with address
   * @example collectionId "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258"
   * @returns
   */
  @Get("{collectionId}")
  public async getCollection(@Path("chain") chain: SupportedChain, @Path() collectionId: string) {
    this.validateChain(chain);

    const collection = EthAddress.parse(collectionId);
    return {
      collection: await CollectionService.getCollection(chain, collection),
    };
  }

  /**
   * Get all tokens of specific collection witha address
   * @example collectionId "0x0c2E57EFddbA8c768147D1fdF9176a0A6EBd5d83"
   * @returns
   */
  @Get("{collectionId}/tokens/all")
  public async getAllCollectionTokens(
    @Path("chain") chain: SupportedChain,
    @Path() collectionId: string
    // @Queries() queries: Record<string, any>
  ): Promise<any> {
    this.validateChain(chain);
    const collection = EthAddress.parse(collectionId);

    const tokens = await CollectionService.getCollectionAllTokens(chain, collection);
    return {
      tokens,
    };
  }

  /**
   * Get all tokens of specific collection witha address
   * @example collectionId "0x0c2E57EFddbA8c768147D1fdF9176a0A6EBd5d83"
   * @returns
   */
  @Get("{collectionId}/tokens")
  @OperationId("getCollectionTokens")
  public async getCollectionTokens(
    @Path("chain") chain: SupportedChain,
    @Path() collectionId: string,
    @Query("ids") ids: string
  ): Promise<any> {
    this.validateChain(chain);
    const collection = EthAddress.parse(collectionId);
    const tokenIds = TokenIds.parse(ids);

    const response = await CollectionService.getCollectionTokens(chain, collection, tokenIds);

    return response;
  }
}
