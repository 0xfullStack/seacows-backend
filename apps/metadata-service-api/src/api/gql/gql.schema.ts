import { EthAddress } from "src/schemas/common";
import z from "zod";

export const GetPoolNftsArgs = z.object({
  first: z.number().int().min(1).optional(),
  skip: z.number().int().min(0).optional(),
  collection: EthAddress.optional(),
  token: EthAddress.optional(),
});

// https://github.com/lukeautry/tsoa/issues/1256#issuecomment-1333814661
// export type IGetPoolNftsArgs = ReturnType<typeof GetPoolNftsArgs.parse>;
export interface GetPoolNftsArgs {
  first?: number;
  skip?: number;
  collection?: string;
  token?: string;
}

export const GetPoolSwapsArgs = z.object({
  first: z.number().int().min(1).optional(),
  skip: z.number().int().min(0).optional(),
  collection: EthAddress.optional(),
  origin: z.string().optional(),
});

export interface GetPoolSwapsArgs {
  first?: number;
  skip?: number;
  collection?: string;
  origin?: string;
}

export const GetPoolMintsArgs = z.object({
  first: z.number().int().min(1).optional(),
  skip: z.number().int().min(0).optional(),
  collection: EthAddress.optional(),
  origin: z.string().optional(),
});

export interface GetPoolMintsArgs {
  first?: number;
  skip?: number;
  collection?: string;
  origin?: string;
}

export const GetPoolBurnsArgs = z.object({
  first: z.number().int().min(1).optional(),
  skip: z.number().int().min(0).optional(),
  collection: EthAddress.optional(),
  origin: z.string().optional(),
});

export interface GetPoolBurnsArgs {
  first?: number;
  skip?: number;
  collection?: string;
  origin?: string;
}

export const GetPositionArgs = z.object({
  first: z.number().int().min(1).optional(),
  skip: z.number().int().min(0).optional(),
  owner: EthAddress,
  slots: z.string().array().optional(),
  ids: z.string().array().optional(),
});

export interface GetPositionArgs {
  first?: number;
  skip?: number;
  owner: string;
  slots?: string[];
  ids?: string[];
}

export const GetSpeedBumpPositionArgs = z.object({
  id: EthAddress,
});

export interface GetSpeedBumpPositionArgs {
  id: string;
}
