import z from "zod";
import logger from "./utils/logger";
import { getKeysFromProcessEnv } from "./utils/shared";

export const AppEnv = z
  .object({
    CHAIN_ID: z.coerce.number(),
    DATABASE_URL: z.string(),
    MORALIS_API_KEY: z.string(),
  })
  .transform((x) => ({
    ...x,
    RESERVIOR_API_KEYS: getKeysFromProcessEnv("RESERVOIR_API_KEY"),
    LOOKSRARE_API_KEYS: getKeysFromProcessEnv("LOOKSRARE_API_KEY"),
  }))
  .refine(
    (x) => x.RESERVIOR_API_KEYS.length >= 1 && x.LOOKSRARE_API_KEYS.length >= 1
  );

export type AppEnv = z.infer<typeof AppEnv>;

export function getAppEnv(processEnv: unknown = process.env): AppEnv {
  const env = AppEnv.parse(processEnv);

  logger.info("Backend Config", {
    startupTime: Date.now(),
    nodeEnv: process.env.NODE_ENV,
    apiKeys: {
      moralis: env.MORALIS_API_KEY.slice(0, 4) + "...",
      looksrare: env.LOOKSRARE_API_KEYS.length,
      reservoir: env.RESERVIOR_API_KEYS.length,
    },
  });

  return env;
}

export default getAppEnv();
