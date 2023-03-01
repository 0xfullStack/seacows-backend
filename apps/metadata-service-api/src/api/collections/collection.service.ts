import { ZeroAddress } from "ethers";
import prisma from "src/utils/prisma";
import external from "src/services";
// import { Context } from "../../app";

const getCollection = async (collectionAddress: string) => {
  // const { db, external } = ctx;

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
          address: ZeroAddress,
        },
      },
      createdAt: rCollection.createdAt,
    },
  });

  return created;
};

export default {
  getCollection,
};
