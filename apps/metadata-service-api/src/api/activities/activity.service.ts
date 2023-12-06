import prisma from "src/utils/prisma";
import { SupportedChain, SupportedChainId } from "src/env";

const isEligible = async (chain: SupportedChain, address: string) => {
  const record = await prisma.read.whitelist.findUnique({
    where: {
      networkId_address: {
        networkId: SupportedChainId[chain],
        address: address,
      },
    },
  });
  return record != null;
};

export default {
  isEligible,
};
