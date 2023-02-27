import z from "zod";
import logger from "./utils/logger";
import { getKeysFromProcessEnv } from "./utils/shared";

export const AppEnv = z
  .object({
    LOOKSRARE_API_KEY: z.string(),
    DATABASE_URL: z.string(),
  })
  .transform((x) => ({ ...x, RESERVIOR_API_KEYS: getKeysFromProcessEnv('RESERVOIR_API_KEY') }))
  .refine((x) => x.RESERVIOR_API_KEYS.length >= 1);

export type AppEnv = z.infer<typeof AppEnv>;

export function getAppEnv(processEnv: unknown = process.env): AppEnv {
  const env = AppEnv.parse(processEnv);

  logger.info("Backend Config", {
    startupTime: Date.now(),
    nodeEnv: process.env.NODE_ENV,
    apiKeys: {
      looksrare: !!env.LOOKSRARE_API_KEY,
      reservoir: env.RESERVIOR_API_KEYS.length >= 1,
    }
  });

  return env;
}
