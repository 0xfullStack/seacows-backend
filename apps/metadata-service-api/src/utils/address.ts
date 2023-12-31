import { utils } from "ethers";

export const checksumAddress = (address: string) => {
  try {
    return utils.getAddress(address.toLowerCase());
  } catch {}

  return address;
};

export function getChainAddress(chain: string, address: string) {
  return chain + "-" + address;
}
