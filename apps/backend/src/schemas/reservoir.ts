import { isAddress } from "ethers";
import { z } from "zod";
import { checksumAddress } from "../utils/address";

export const EthAddress = z.string().length(42)
.transform(checksumAddress)
.refine(addr => isAddress(addr), { message: 'Provided address in not an Ethereum address'});

// https://docs.reservoir.tools/reference/getcollectionsv5
export const ReservoirCollection = z.object({
  id: EthAddress,
  slug: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  image: z.string().url(),
  banner: z.string().url(),
  discordUrl: z.string().url().optional(),
  externalUrl: z.string().url().optional(),
  twitterUsername: z.string().optional(),
  openseaVerificationStatus: z.string(), // 'verified', 'disabled_top_trending'
  description: z.string(),
  tokenCount: z.coerce.number(),
  onSaleCount: z.coerce.number(),
  primaryContract: EthAddress,
  rank: z.object({
    "1day": z.number(),
    "7day": z.number(),
    "30day": z.number(),
    "allTime": z.number(),
  }),
});
export type ReservoirCollection = z.infer<typeof ReservoirCollection>;

export const ReservoirCollectionResponse = z.object({
  collections: z.array(ReservoirCollection)
});
export type ReservoirCollectionResponse = z.infer<typeof ReservoirCollectionResponse>;

// https://docs.reservoir.tools/reference/gettokensv5
export const ReservoirToken = z.object({
  contract: EthAddress,
  tokenId: z.coerce.number().transform(id => id.toString()),
  name: z.string().nullable(),
  description: z.string().nullable(),
  image: z.string().url().nullable(),
  media: z.string().url().nullable(),
  kind: z.enum(["erc721", "erc1155"]),
  isFlagged: z.boolean(),
  lastFlagUpdate: z.string().datetime(),
  rarity: z.coerce.number().transform(id => id.toString()),
  rarityRank: z.coerce.number().transform(id => id.toString()),
  owner: EthAddress,
});
export type ReservoirToken = z.infer<typeof ReservoirToken>;

export const ReservoirTokenResponse = z.object({
  tokens: z.array(z.object({
    token: ReservoirToken,
    market: z.object({}),
  })),
  continuation: z.string(),
});
export type ReservoirTokenResponse = z.infer<typeof ReservoirTokenResponse>;
