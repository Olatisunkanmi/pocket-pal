import { CrudService } from '../common/database/crud.service';
import { UsersMapType } from '../users/users.maptype';
import { Injectable } from '@nestjs/common';
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

  /**
   * Create User in DB
   */
  async createUser(dto: UserSignUpDto, password?: string) {
    try {
      const user = (await this.prisma.user.create({
        data: {
          ...dto,
        },
        select: {
          id: true,
          email: true,
        },
      })) as User;
      return user;
    } catch (error) {
      console.log('Error Creating User', error);
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
