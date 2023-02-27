
import { isAddress } from "ethers";
import { z } from "zod";
import { checksumAddress } from "../utils/address";

export const EthAddress = z.string().length(42)
.transform(checksumAddress)
.refine(addr => isAddress(addr), { message: 'Provided address in not an Ethereum address'});
