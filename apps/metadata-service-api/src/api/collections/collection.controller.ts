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
  BodyProp,
} from "tsoa";
import { EthAddress, TokenIds, TokenId } from "src/schemas/common";
import { SearchCollectionName } from "./collection.schema";
import CollectionService from "./collection.service";
import { SupportedChain } from "src/env";
import { BaseController } from "../baseController";
import { getAmmPools } from "src/graphql/amm";
import { ReservoirCollectionMetadata } from "src/schemas/reservoir";
import { state } from "src/redis";
import { LockNFTDto, UnlockNFTDto } from "./collection.dto";

@Route(":chain/collections")
@Tags("collection")
export class CollectionController extends BaseController {
  @Get("search")
  /**
   * Search collections with params like name, etc
   */
  public async searchCollections(
    @Path("chain") chain: SupportedChain,
    @Query() name: string,
    @Query() checkPool: string
  ) {
    this.validateChain(chain);

    const queryName = SearchCollectionName.parse(name);
    const checkPoolStatus = checkPool === "true";

    console.log("checkPool", checkPool);

    const result = await CollectionService.searchCollections(chain, queryName);
    const collectionIds = (result.collections || [])
      .map((c) => c.contract?.toLowerCase())
      .filter((c) => !!c) as string[];

    if (checkPoolStatus) {
      const pools = await getAmmPools({ chain, where: { collections: collectionIds } });

      const status: Record<string, boolean> = {};
      for (const pool of pools) {
        status[pool.collection.id] = true;
      }

      return {
        ...result,
        status,
      };
    }

    return result;
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
  ) {
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
  ) {
    this.validateChain(chain);
    const collection = EthAddress.parse(collectionId);
    const tokenIds = TokenIds.parse(ids);

    const response = await CollectionService.getCollectionTokens(chain, collection, tokenIds);

    return response;
  }

  /**
   * Get specific collection metadata and statistics with address
   * @example collectionId "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
   * @returns
   */
  @Get("{collectionId}/metadata")
  public async getCollectionMetadata(@Path("chain") chain: SupportedChain, @Path() collectionId: string) {
    this.validateChain(chain);

    const collection = EthAddress.parse(collectionId);
    const { collections } = await CollectionService.getCollectionMetadata(chain, collection);
    return {
      collection: collections[0],
    } as {
      collection: ReservoirCollectionMetadata;
    };
  }

  /**
   * lock the nft
   * @example collectionId "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
   * @example tokenId "1"
   * @returns is lock succeed
   */
  @Post("{collectionId}/tokens/{tokenId}/lock")
  public async lockNFT(
    @Path("chain") chain: SupportedChain,
    @Path() collectionId: string,
    @Path() tokenId: string,
    @Body() dto: LockNFTDto
  ) {
    this.validateChain(chain);
    const collection = EthAddress.parse(collectionId);
    TokenId.parse(tokenId);
    LockNFTDto.parse(dto);
    const userId = EthAddress.parse(dto.userId);

    await state.lockNFT(chain, collection, tokenId, userId);
    return true;
  }

  /**
   * unlock the nft
   * @example collectionId "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
   * @example tokenId "1"
   * @returns is unlock succeed
   */
  @Post("{collectionId}/tokens/{tokenId}/unlock")
  public async unlockNFT(
    @Path("chain") chain: SupportedChain,
    @Path() collectionId: string,
    @Path() tokenId: string,
    @Body() dto: UnlockNFTDto
  ) {
    const collection = EthAddress.parse(collectionId);
    TokenId.parse(tokenId);
    LockNFTDto.parse(dto);
    const userId = EthAddress.parse(dto.userId);

    await state.unlockNFT(chain, collection, tokenId, userId);
    return true;
  }

  /**
   * get the nft state
   * @example collectionId "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
   * @example tokenId "1"
   * @returns the nft locked status
   */
  @Get("{collectionId}/tokens/{tokenId}/state")
  public async getNFTState(
    @Path("chain") chain: SupportedChain,
    @Path() collectionId: string,
    @Path() tokenId: string
  ) {
    this.validateChain(chain);
    const collection = EthAddress.parse(collectionId);

    return await state.getNFTLocker(chain, collection, tokenId);
  }
}
