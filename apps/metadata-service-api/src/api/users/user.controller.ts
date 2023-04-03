import { Collection } from "@prisma/client";
import { Body, Controller, Example, Request, Get, Path, Post, Query, Route, SuccessResponse, Queries } from "tsoa";
import { EthAddress } from "../../schemas/common";
import { GetUserTokensArgs } from "./user.schema";
import UserService from "./user.service";

@Route("users")
export class UserController extends Controller {
  /**
   *
   * @example userId "0x54BE3a794282C030b15E43aE2bB182E14c409C5e"
   * @returns
   */
  @Get("{userId}/tokens")
  public async getUserTokens(@Path() userId: string, @Queries() params: GetUserTokensArgs): Promise<any> {
    const account = EthAddress.parse(userId);
    const args = GetUserTokensArgs.parse(params);

    const response = await UserService.getUserTokens(account, args.collection, args.continuation);

    return response;
  }
}
