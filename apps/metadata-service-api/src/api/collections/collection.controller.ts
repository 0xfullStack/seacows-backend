import { Collection } from "@prisma/client";
import { Body, Controller, Example, Request, Get, Path, Post, Query, Route, SuccessResponse } from "tsoa";
import { EthAddress } from "../../schemas/common";
import CollectionService from "./collection.service";

@Route("collections")
export class CollectionController extends Controller {
  /**
   *
   * @example collectionId "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258"
   * @returns
   */
  @Get("{collectionId}")
  // @Example<Collection>({})
  public async getCollection(@Path() collectionId: string): Promise<any> {
    const collection = EthAddress.parse(collectionId);
    return {
      collection: await CollectionService.getCollection(collection),
    };
  }
}
