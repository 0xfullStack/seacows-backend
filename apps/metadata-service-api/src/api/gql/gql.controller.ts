import { Get, Path, Route, Queries, Tags } from "tsoa";
import { BaseController } from "../baseController";
import { SupportedChain } from "src/env";
import { getPoolsData, getAmmPoolNfts } from "src/graphql/amm";
import { getSwaps } from "src/graphql/swap";
import { getMints } from "src/graphql/mint";
import { getBurns } from "src/graphql/burn";
import { getAMMPositions, getOwnerPositions, getTotalAMMPositions, getTotalOwnerPositions } from "src/graphql/position";
import { getSpeedBumpPosition } from "src/graphql/speedBumpPosition";

import {
  GetPoolBurnsArgs,
  GetPoolMintsArgs,
  GetPoolNftsArgs,
  GetPoolSwapsArgs,
  GetPositionArgs,
  GetSpeedBumpPositionArgs,
} from "./gql.schema";

@Route(":chain/proxy")
@Tags("SubGraph")
export class SubGraphController extends BaseController {
  /**
   *
   * @returns
   */
  @Get("pools")
  public async getPoolsData(@Path("chain") chain: SupportedChain) {
    this.validateChain(chain);

    const response = await getPoolsData({ chain });

    return response;
  }

  /**
   *
   * @example collection "0x5ee40fa926014b43a07242728397c0438b9097"
   * @example token "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"
   * @returns
   */
  @Get("pool-nfts")
  public async getPoolNfts(@Path("chain") chain: SupportedChain, @Queries() params: GetPoolNftsArgs) {
    this.validateChain(chain);
    GetPoolNftsArgs.parse(params);
    const where = { first: params.first, skip: params.skip, collection: params.collection, token: params.token };
    const response = await getAmmPoolNfts({ chain, where });

    return response;
  }

  @Get("pool-swaps")
  public async getPoolSwaps(@Path("chain") chain: SupportedChain, @Queries() params: GetPoolSwapsArgs) {
    this.validateChain(chain);
    GetPoolSwapsArgs.parse(params);
    const where = { first: params.first, skip: params.skip, collection: params.collection, origin: params.origin };
    const response = await getSwaps({ first: params.first, skip: params.skip, chain, where });

    return response;
  }

  @Get("pool-mints")
  public async getPoolMints(@Path("chain") chain: SupportedChain, @Queries() params: GetPoolMintsArgs) {
    this.validateChain(chain);
    GetPoolMintsArgs.parse(params);
    const where = { first: params.first, skip: params.skip, collection: params.collection, origin: params.origin };
    const response = await getMints({ first: params.first, skip: params.skip, chain, where });

    return response;
  }

  @Get("pool-burns")
  public async getPoolWithdraw(@Path("chain") chain: SupportedChain, @Queries() params: GetPoolBurnsArgs) {
    this.validateChain(chain);
    GetPoolBurnsArgs.parse(params);
    const where = { first: params.first, skip: params.skip, collection: params.collection, origin: params.origin };
    const response = await getBurns({ first: params.first, skip: params.skip, chain, where });

    return response;
  }

  @Get("amm-positions")
  public async getAMMPositions(@Path("chain") chain: SupportedChain, @Queries() params: GetPositionArgs) {
    this.validateChain(chain);
    GetPositionArgs.parse(params);
    const first = params.first || 1000;
    const skip = params.skip || 0;
    const where = { first, skip, owner: params.owner, slots: params.slots };
    const [total, data] = await Promise.all([
      getTotalAMMPositions({ chain, where }), // total amm
      getAMMPositions({ first, skip, chain, where }),
    ]);
    const response = {
      total,
      first,
      skip,
      data,
    };
    return response;
  }

  @Get("owner-positions")
  public async getOwnerPositions(@Path("chain") chain: SupportedChain, @Queries() params: GetPositionArgs) {
    this.validateChain(chain);
    GetPositionArgs.parse(params);
    const first = params.first || 1000;
    const skip = params.skip || 0;
    const where = { first, skip, owner: params.owner, ids: params.ids };
    const [total, data] = await Promise.all([
      getTotalOwnerPositions({ chain, where }),
      await getOwnerPositions({ first, skip, chain, where }),
    ]);
    const response = {
      total,
      first,
      skip,
      data,
    };
    return response;
  }

  @Get("speedbump-position")
  public async getSpeedBumpPosition(@Path("chain") chain: SupportedChain, @Queries() params: GetSpeedBumpPositionArgs) {
    this.validateChain(chain);
    GetSpeedBumpPositionArgs.parse(params);
    const response = await getSpeedBumpPosition({ chain, id: params.id });

    return response;
  }
}
