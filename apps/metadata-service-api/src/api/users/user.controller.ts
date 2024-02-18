import { Get, Path, Route, Queries, Tags } from "tsoa";
import { EthAddress } from "../../schemas/common";
import { GetUserTokensArgs, GetUserCollectionsArgs } from "./user.schema";
import UserService from "./user.service";
import { BaseController } from "../baseController";
import { SupportedChain } from "src/env";
import { getAmmPools } from "src/graphql/amm";
import { ethers } from "ethers";

@Route(":chain/users")
@Tags("user")
export class UserController extends BaseController {
  /**
   *
   * @example userId "0x54BE3a794282C030b15E43aE2bB182E14c409C5e"
   * @returns
   */
  @Get("{userId}/tokens")
  public async getUserTokens(
    @Path("chain") chain: SupportedChain,
    @Path() userId: string,
    @Queries() params: GetUserTokensArgs
  ) {
    this.validateChain(chain);
    const account = EthAddress.parse(userId);
    const args = GetUserTokensArgs.parse(params);

    const response = await UserService.getUserTokens(chain, account, args.collection, args.continuation);

    return response;
  }

  /**
   *
   * @example userId "0xF296178d553C8Ec21A2fBD2c5dDa8CA9ac905A00"
   * @example collection "0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63"
   * @example name "ape"
   * @returns
   */
  @Get("{userId}/collections")
  public async getUserCollections(
    @Path("chain") chain: SupportedChain,
    @Path() userId: string,
    @Queries() params: GetUserCollectionsArgs
  ) {
    this.validateChain(chain);
    const account = EthAddress.parse(userId);
    const args = GetUserCollectionsArgs.parse(params);

    const response = await UserService.getUserCollections(chain, account, args.collection, args.name);

    return response;
  }

  /**
   * 1. verify the collection is ERC721
   * 2. the collection is amm pool address
   * 3. user owns the nfts of collection
   * @example userId "0xF296178d553C8Ec21A2fBD2c5dDa8CA9ac905A00"
   * @example collection "0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63"
   * @returns
   */
  @Get("{userId}/collections/{collection}/available")
  public async verifyCollection(
    @Path("chain") chain: SupportedChain,
    @Path() userId: string,
    @Path() collection: string
  ) {
    const response = {
      isERC721: false,
      isPool: false,
      hasNfts: false,
    };
    this.validateChain(chain);
    response.isERC721 = ethers.utils.isAddress(collection);
    if (!response.isERC721) return response;

    const [ammPools, userTokens] = await Promise.all([
      getAmmPools({ chain, where: { collections: [collection] } }), // user collection
      UserService.getUserTokens(chain, userId, collection, undefined, 1), // use collection tokens
    ]);

    response.isPool = !!ammPools?.length;
    response.hasNfts = !!userTokens?.tokens?.length;

    return response;
  }
}
