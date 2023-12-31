import z from "zod";
import logger from "./utils/logger";
import { getKeysFromProcessEnv } from "./utils/shared";
import { ChainName } from "./schemas/common";

export const SupportedChains = ["mainnet", "goerli", "sepolia"] as const;
export type SupportedChain = (typeof SupportedChains)[number];

// check prisma/seed.ts, chainId should match with the network ids in the database
export const SupportedChainId: Record<SupportedChain, number> = {
  mainnet: 1,
  goerli: 5,
  sepolia: 11155111,
};

export const SupportedSubgraphEndpoint: Record<SupportedChain, string> = {
  mainnet: "https://subgraph-mainnet-prod.seacows.io/subgraphs/name/seacows/seacows-amm-subgraph",
  goerli: "https://api.studio.thegraph.com/query/54972/goerli-seacows-amm/version/latest",
  sepolia: "https://subgraph-sepolia-dev.seacows.io/subgraphs/name/seacows/seacows-amm-subgraph",
};

export const AppEnv = z
  .object({
    CHAINS: z.string().transform((str) => str.split(",")),
    CRON_PATTERN: z.string(),
    REDIS_URL: z.string(),
    DATABASE_URL: z.string(),
    MORALIS_API_KEY: z.string(),
  })
  .transform((x) => ({
    ...x,
    RESERVIOR_API_KEYS: {
      mainnet: getKeysFromProcessEnv("RESERVOIR_API_KEY_MAINNET"),
      goerli: getKeysFromProcessEnv("RESERVOIR_API_KEY_GOERLI"),
      sepolia: getKeysFromProcessEnv("RESERVOIR_API_KEY_SEPOLIA"),
    },
    LOOKSRARE_API_KEYS: getKeysFromProcessEnv("LOOKSRARE_API_KEY"),
  }))
  .refine(
    (x) =>
      x.RESERVIOR_API_KEYS.mainnet.length >= 1 &&
      x.RESERVIOR_API_KEYS.goerli.length >= 1 &&
      x.LOOKSRARE_API_KEYS.length >= 1
  );

export type AppEnv = z.infer<typeof AppEnv>;

export function validateChain(chain: string) {
  try {
    ChainName.parse(chain);
    return true;
  } catch {
    return false;
  }
}

export function getAppEnv(processEnv: unknown = process.env): AppEnv {
  const env = AppEnv.parse(processEnv);

  logger.info("Backend Config", {
    startupTime: Date.now(),
    nodeEnv: process.env.NODE_ENV,
    apiKeys: {
      moralis: env.MORALIS_API_KEY.slice(0, 4) + "...",
      looksrare: env.LOOKSRARE_API_KEYS.length,
      reservoir: {
        mainnet: env.RESERVIOR_API_KEYS.mainnet.length,
        goerli: env.RESERVIOR_API_KEYS.goerli.length,
        sepolia: env.RESERVIOR_API_KEYS.sepolia.length,
      },
    },
  });

  return env;
}

export default getAppEnv();
