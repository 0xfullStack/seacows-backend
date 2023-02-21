import logger from "./logger";

/**
 * Attempt to safely parse an unknown JSON response.
 */
export function attemptParseJson<T>(data: unknown): T {
  const maybeString = data as string;
  return JSON.parse(maybeString) as T;
}
