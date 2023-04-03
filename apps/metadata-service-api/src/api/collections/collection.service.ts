import { constants } from "ethers";
import { Prisma } from "@prisma/client";
import prisma from "src/utils/prisma";
import external from "src/services";
import { ReservoirTokenResponse } from "src/schemas/reservoir";

const getCollection = async (collectionAddress: string) => {
  const collection = await prisma.read.collection.findUnique({
    where: {
      address: collectionAddress,
    },
  });

  if (collection) {
    return collection;
  }

  const { collections } = await external.reservoirApi.requestCollections(collectionAddress);
  const rCollection = collections[0];

  const created = await prisma.write.collection.create({
    data: {
      address: collectionAddress,
      isVerified: rCollection.openseaVerificationStatus === "verified",
      osSlug: rCollection.slug,
      name: rCollection.name,
      description: rCollection.description,
      logo: rCollection.image,
      banner: rCollection.banner,
      websiteLink: rCollection.externalUrl,
      twitterLink: rCollection.twitterUsername,
      type: "ERC721",
      owner: {
        create: {
          address: constants.AddressZero,
        },
      },
      createdAt: rCollection.createdAt,
    },
  });

  return created;
};

const saveReservoirCollectionTokens = (collectionId: number, tokens: ReservoirTokenResponse["tokens"]) => {
  return prisma.write.token.createMany({
    data: tokens.map(({ token }) => ({
      tokenId: new Prisma.Decimal(token.tokenId),
      collectionId,
      name: token.name || `#${token.tokenId}`,
      image: token.image,
      flagId: token.isFlagged ? 1 : 0,
      description: token.description,
    })),
  });
};

const getCollectionTokens = async (collectionAddress: string) => {
  const collection = await getCollection(collectionAddress);

  const tokens = await external.reservoirApi.requestMaxTokens(collectionAddress, undefined, (tokens) =>
    saveReservoirCollectionTokens(collection.id, tokens)
  );

  return tokens;
};

const searchCollections = async (name: string) => {
  return external.reservoirApi.searchCollections(name);
};

const getTrendingCollections = async () => {
  return external.reservoirApi.requestMultipleCollections("30DayVolume", 12);
};

export default {
  getCollection,
  searchCollections,
  getCollectionTokens,
  getTrendingCollections,
};
