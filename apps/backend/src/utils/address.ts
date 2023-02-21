import { getAddress } from "ethers";

export const checksumAddress = (address: string) => {
  try {
    return getAddress(address.toLowerCase());
  } catch {}

  return address;
}
