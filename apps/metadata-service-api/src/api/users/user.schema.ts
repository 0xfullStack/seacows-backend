import { EthAddress } from "src/schemas/common";
import z from "zod";

export const GetUserTokensArgs = z.object({
  collection: EthAddress.optional(),
  continuation: z.string().optional(),
});

// export type GetUserTokensArgs = z.infer<typeof GetUserTokensArgs>;
// export type GetUserTokensArgs = ReturnType<typeof GetUserTokensArgs.parse>;

export interface GetUserTokensArgs {
  collection?: string;
  continuation?: string;
}

export const GetUserCollectionsArgs = z.object({
  collection: EthAddress.optional(),
  name: z.string().optional(),
});

export interface GetUserCollectionsArgs {
  collection?: string;
  name?: string;
}
