import { Path, Route, Body, Tags, Get } from "tsoa";
import { EthAddress } from "../../schemas/common";
import ActivityService from "./activity.service";
import { BaseController } from "../baseController";
import { SupportedChain } from "src/env";

@Route(":chain/eligible")
@Tags("activity")
export class ActivityController extends BaseController {
  @Get("{address}")
  public async eligible(@Path("chain") chain: SupportedChain, @Path() address: string) {
    this.validateChain(chain);
    const eligible = await ActivityService.isEligible(chain, EthAddress.parse(address).toLowerCase());
    this.setStatus(eligible ? 200 : 400);
  }
}
