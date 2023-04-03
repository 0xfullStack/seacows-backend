import { utils, BigNumber } from "ethers";
import { z } from "zod";
import { checksumAddress } from "../utils/address";

export const EthAddress = z
  .string()
  .length(42)
  .transform(checksumAddress)
  .refine((addr) => utils.isAddress(addr), { message: "Provided address in not an Ethereum address" });

// Zod BigNumber ensures that input is transformed into an actual
// Ethers BigNumber type
export const ZodBigNumber = z
  .custom<BigNumber>()
  .refine((x) => typeof x === "string" || typeof x === "number" || typeof x === "bigint", {
    message: "Invalid type of input for BigNumber conversion. Expected numberish input.",
  })
  .transform((x) => BigNumber.from(String(x)));
