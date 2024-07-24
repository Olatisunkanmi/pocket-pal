import { CrudService } from '../common/database/crud.service';
import { UsersMapType } from '../users/users.maptype';
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { updateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from 'src/auth/dto/auth.dto';

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

  async findUserByEmail(email: string) {
    return await this.findUnique({
      where: {
        email,
      },
    });
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
  public async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },

      select: {
        id: true,
        email: true,
      },
    });
  }
  /**
   * Del User
   */
  public async deleteUserById(id: any) {
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'User Deleted',
    };
  }
  /**
   * Update User
   */
  public async updateById(id: any, data: updateUserDto) {
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data,
      select: {
        id: true,
        email: true,
      },
    });
  }

  /**
   * Find All Users
   */
  public async getAllUsers(): Promise<any> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }
}
