import { Prisma } from '@prisma/client';
import { CrudMapType } from 'src/common/interfaces/crud-map-type.interface';

export class TransactionsMapType implements CrudMapType {
  aggregate: Prisma.TransactionAggregateArgs;
  count: Prisma.TransactionCountArgs;
  create: Prisma.TransactionCreateArgs;
  createMany: Prisma.TransactionCreateManyArgs;
  delete: Prisma.TransactionDeleteArgs;
  deleteMany: Prisma.TransactionDeleteManyArgs;
  findFirst: Prisma.TransactionFindFirstArgs;
  findMany: Prisma.TransactionFindManyArgs;
  findUnique: Prisma.TransactionFindUniqueArgs;
  update: Prisma.TransactionUpdateArgs;
  updateMany: Prisma.TransactionUpdateManyArgs;
  upsert: Prisma.TransactionUpsertArgs;
}
