import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {}

main()
  .then(() => {
    console.info("Finished seeding data.");
  })
  .catch((error) => {
    console.error(error);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
