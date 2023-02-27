import { ZeroAddress } from "ethers";
import { Context } from "../../app";

export class CollectionService {
  public async getCollection(ctx: Context, collectionAddress: string) {
    const { db, external } = ctx;

    const collection = await db.read.collection.findUnique({
      where: {
        address: collectionAddress
      }
    });

    if (collection) {
      return collection;
    }

    const { collections } = await external.reservoirApi.requestCollections(collectionAddress);
    const rCollection = collections[0];

    const created = await db.write.collection.create({
      data: {
        address: collectionAddress,
        isVerified: rCollection.openseaVerificationStatus === 'verified',
        osSlug: rCollection.slug,
        name: rCollection.name,
        description: rCollection.description,
        logo: rCollection.image,
        banner: rCollection.banner,
        websiteLink: rCollection.externalUrl,
        twitterLink: rCollection.twitterUsername,
        type: 'ERC721',
        owner: {
          create: {
            address: ZeroAddress
          }
        },
        createdAt: rCollection.createdAt
      }
    })
    
    return created;
  }
}

