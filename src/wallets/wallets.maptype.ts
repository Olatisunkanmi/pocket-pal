import { Prisma } from '@prisma/client';
import { CrudMapType } from 'src/common/interfaces/crud-map-type.interface';

export class WalletsMapType implements CrudMapType {
  aggregate: Prisma.WalletAggregateArgs;
  count: Prisma.WalletCountArgs;
  create: Prisma.WalletCreateArgs;
  createMany: Prisma.WalletCreateManyArgs;
  delete: Prisma.WalletDeleteArgs;
  deleteMany: Prisma.WalletDeleteManyArgs;
  findFirst: Prisma.WalletFindFirstArgs;
  findMany: Prisma.WalletFindManyArgs;
  findUnique: Prisma.WalletFindUniqueArgs;
  update: Prisma.WalletUpdateArgs;
  updateMany: Prisma.WalletUpdateManyArgs;
  upsert: Prisma.WalletUpsertArgs;
}
