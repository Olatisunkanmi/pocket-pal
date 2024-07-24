import { PrismaClient } from '.prisma/client';
import { SeedRunner } from './interface';

export default class RemoveNonUniqueUsersRunner extends SeedRunner {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async run() {
    await this.prisma.$transaction(async (tPrisma: PrismaClient) => {
      const duplicateEmails = await tPrisma.user.groupBy({
        by: ['email'],
        having: { email: { _count: { gt: 1 } } },
      });

      const setOfDuplicates = new Set([
        ...duplicateEmails.map((entry) => entry.email),
      ]);
      const nonUniqueUsers = Array.from(setOfDuplicates);

      if (nonUniqueUsers.length)
        await tPrisma.user.deleteMany({
          where: {
            OR: [{ email: { in: nonUniqueUsers } }],
          },
        });
    });
  }
}
