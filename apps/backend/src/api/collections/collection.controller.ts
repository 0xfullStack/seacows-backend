import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";

@Route("collections")
export class CollectionController extends Controller {
  @Get("{collectionId}")
  public async getCollection(@Path() collectionId: string): Promise<any> {
    // return new UsersService().get(userId, name);
    return { collectionId };
  }
}
