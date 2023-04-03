import { Body, Controller, Example, Request, Get, Path, Post, Query, Route, SuccessResponse, Queries } from "tsoa";
import { QueryTokensArgs } from "./token.schema";
import TokenService from "./token.service";

@Route("tokens")
export class TokenController extends Controller {
  /**
   *
   * @returns
   */
  @Get("query")
  public async queryTokens(@Queries() params: QueryTokensArgs): Promise<any> {
    const args = QueryTokensArgs.parse(params);

    return await TokenService.queryTokensWithMoralis({
      ...args,
      from_date: args.from_date?.toISOString(),
      to_date: args.to_date?.toISOString(),
    });
  }
}
