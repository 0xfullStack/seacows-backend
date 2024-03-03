import { z } from "zod";
import { EthAddress } from "./common";

// https://docs.reservoir.tools/reference/getcollectionsv5
export const ReservoirCollection = z.object({
  id: EthAddress,
  slug: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  image: z.string().url(),
  banner: z.string().url().nullable(),
  discordUrl: z.string().url().optional().nullable(),
  externalUrl: z.string().url().optional().nullable(),
  twitterUsername: z.string().optional().nullable(),
  openseaVerificationStatus: z.string(), // 'verified', 'disabled_top_trending'
  description: z.string().nullable(),
  tokenCount: z.coerce.number(),
  onSaleCount: z.coerce.number(),
  primaryContract: EthAddress,
  rank: z.object({
    "1day": z.number().nullable(),
    "7day": z.number().nullable(),
    "30day": z.number().nullable(),
    allTime: z.number().nullable(),
  }),
});
export type ReservoirCollection = z.infer<typeof ReservoirCollection>;

export const ReservoirCollectionResponse = z.object({
  collections: z.array(ReservoirCollection),
});
export type ReservoirCollectionResponse = z.infer<typeof ReservoirCollectionResponse>;

// https://docs.reservoir.tools/reference/gettokensv5
export const ReservoirToken = z.object({
  contract: EthAddress,
  tokenId: z.coerce.number().transform((id) => id.toString()),
  name: z.string().nullable(),
  description: z.string().nullable(),
  image: z.string().url().nullable(),
  media: z.string().url().nullable(),
  kind: z.enum(["erc721", "erc1155"]),
  isFlagged: z.boolean().nullable(),
  lastFlagUpdate: z.string().datetime().nullable(),
  rarity: z.coerce.number().transform((id) => id.toString()),
  rarityRank: z.coerce.number().transform((id) => id.toString()),
  owner: EthAddress,
});
export type ReservoirToken = z.infer<typeof ReservoirToken>;

export const ReservoirTokenResponse = z.object({
  tokens: z.array(
    z.object({
      token: ReservoirToken,
      market: z.object({}),
    })
  ),
  continuation: z.string().nullable(),
});
export type ReservoirTokenResponse = z.infer<typeof ReservoirTokenResponse>;

export const ReservoirSale = z.object({
  id: z.string().nullable(),
  sourceDomain: z.string().nullable(),
  price: z
    .object({
      currency: z.object({
        contract: z.string().nullable(),
        name: z.string().nullable(),
        symbol: z.string().nullable(),
        decimals: z.number().nullable(),
      }),
      amount: z
        .object({
          raw: z.string().nullable(),
          decimal: z.number().nullable(),
          usd: z.number().nullable(),
          native: z.number().nullable(),
        })
        .optional()
        .nullable(),
      netAmount: z
        .object({
          raw: z.string().nullable(),
          decimal: z.number().nullable(),
          usd: z.number().nullable(),
          native: z.number().nullable(),
        })
        .optional()
        .nullable(),
      maker: z.string().optional().nullable(),
      validFrom: z.number().optional().nullable(),
    })
    .nullable(),
  maker: z.string().nullable(),
  validFrom: z.number().nullable(),
  token: z
    .object({
      contract: z.string().nullable(),
      tokenId: z.string().nullable(),
      name: z.string().nullable(),
      image: z.string().nullable(),
    })
    .optional()
    .nullable(),
});

export const ReservoirStatics = z.object({
  "1day": z.number().optional().nullable(),
  "7day": z.number().optional().nullable(),
  "30day": z.number().optional().nullable(),
  allTime: z.number().optional().nullable(),
});

// https://docs.reservoir.tools/reference/getcollectionsv7
export const ReservoirCollectionMetadata = z.object({
  contractKind: z.enum(["erc721", "erc1155"]),
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  description: z.string().nullable(),
  floorAsk: ReservoirSale.optional().nullable(),
  topBid: ReservoirSale.optional().nullable(),
  rank: ReservoirStatics.optional().nullable(),
  volume: ReservoirStatics.optional().nullable(),
  volumeChange: ReservoirStatics.optional().nullable(),
  floorSale: ReservoirStatics.optional().nullable(),
  floorSaleChange: ReservoirStatics.optional().nullable(),
});

export type ReservoirCollectionMetadata = z.infer<typeof ReservoirCollectionMetadata>;

export const ReservoirCollectionMetadataResponse = z.object({
  collections: z.array(ReservoirCollectionMetadata),
});
export type ReservoirCollectionMetadataResponse = z.infer<typeof ReservoirCollectionMetadataResponse>;

// https://docs.reservoir.tools/reference/getusersusercollectionsv4
export const ReservoirUserCollection = z.object({
  id: z.string().nullable(),
  slug: z.string().nullable(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  isSpam: z.boolean().nullable(),
  banner: z.string().nullable(),
  twitterUrl: z.string().nullable(),
  discordUrl: z.string().nullable(),
  externalUrl: z.string().nullable(),
  twitterUsername: z.string().nullable(),
  openseaVerificationStatus: z.string().nullable(),
  description: z.string().nullable(),
  metadataDisabled: z.boolean().nullable(),
  sampleImages: z.array(z.string()).nullable(),
  floorAskPrice: z.object({
    currency: z.object({
      contract: z.string().nullable(),
      name: z.string().nullable(),
      symbol: z.string().nullable(),
      decimals: z.number().nullable(),
    }),
    amount: z
      .object({
        raw: z.string().nullable(),
        decimal: z.number().nullable(),
        usd: z.number().nullable(),
        native: z.number().nullable(),
      })
      .optional()
      .nullable(),
  }),
  rank: ReservoirStatics.optional().nullable(),
  volume: ReservoirStatics.optional().nullable(),
  volumeChange: ReservoirStatics.optional().nullable(),
  floorSale: ReservoirStatics.optional().nullable(),
  floorSaleChange: ReservoirStatics.optional().nullable(),
});

export const ReservoirUserCollectionOwnership = z.object({
  tokenCount: z.string().nullable(),
  totalValue: z.number().nullable(),
});
export const ReservoirUserCollectionResponse = z.object({
  collections: z.object({
    collection: ReservoirUserCollection.nullable(),
    ownership: ReservoirUserCollectionOwnership.nullable(),
  }),
});
export type ReservoirUserCollectionResponse = z.infer<typeof ReservoirUserCollectionResponse>;
