import { CrudService } from '../common/database/crud.service';
import { UsersMapType } from '../users/users.maptype';
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Wallet } from '@prisma/client';
import { QueryUsersDto, UserSignUpDto } from 'src/auth/dto/auth.dto';
import { PaginationSearchOptionsDto } from 'src/common/database/pagination/pagination-search-options.dto';

export interface User {
  id: string;
  email: string;
}

@Injectable()
export class UsersService extends CrudService<
  Prisma.UserDelegate,
  UsersMapType
> {
  constructor(private readonly prisma: PrismaClient) {
    super(prisma.user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return (await this.findUnique({
      where: {
        email,
      },
    })) as User;
  }

  /**
   * Create User in DB
   */
  async createUser(dto: UserSignUpDto, password: string) {
    try {
      const isExistingUser = await this.findUserByEmail(dto.email);

      if (isExistingUser) {
        throw new ConflictException('CREDENTIALS ALREADY EXIST');
      }

      const user = (await this.create({
        data: {
          ...dto,
          password,
        },
        select: {
          id: true,
          email: true,
        },
      })) as User;
      return user;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Find User
   */
  public async getUserById(
    id: string,
  ): Promise<(Partial<User> & { wallets: Wallet[] }) | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        id: true,
        first_name: true,
        last_name: true,
        wallets: true,
      },
    });
  }

  /**
   * Find All Users
   */
  public async getAllUsers(dto: QueryUsersDto): Promise<any> {
    const ParsedQuery = this.parseQueryFilter(dto, ['name', 'wallets.name']);
    const findArgs = {
      where: { ...ParsedQuery },
      include: { wallets: dto.wallet ? true : false },
    };
    return await this.findManyPaginate(findArgs, dto);
  }
}
