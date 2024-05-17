import { EthAddress } from "src/schemas/common";
import z from "zod";

export const LockNFTDto = z.object({
  userId: EthAddress,
});

/**
 * @example {
 *  "userId": "0xF296178d553C8Ec21A2fBD2c5dDa8CA9ac905A00"
 * }
 */
export interface LockNFTDto {
  userId: string;
}

export const UnlockNFTDto = z.object({
  userId: EthAddress,
});

/**
 * @example {
 *  "userId": "0xF296178d553C8Ec21A2fBD2c5dDa8CA9ac905A00"
 * }
 */
export interface UnlockNFTDto {
  userId: string;
}
