import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { usersDb } from '../database/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    if (!(createUserDto.login && createUserDto.password)) {
      throw new BadRequestException('Invalid data'); // 400
    }

    const newUser = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Number(Date.now()),
      updatedAt: Number(Date.now())
    };
    usersDb.push(newUser);

    const { ...rest } = newUser;
    delete rest.password;
    return rest;
  }

  findAll() {
    return usersDb;
  }

  findOne(id: string) {
    return this.validateUserId(id);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (
      !(updatePasswordDto.oldPassword && updatePasswordDto.newPassword) ||
      typeof updatePasswordDto.oldPassword !== 'string' ||
      typeof updatePasswordDto.newPassword !== 'string'
    ) {
      throw new BadRequestException('Invalid data'); // 400
    }

    const oldUser = this.validateUserId(id);
    if (updatePasswordDto.oldPassword !== oldUser.password) {
      throw new ForbiddenException('Old password is wrong'); // 403
    }

    const version = oldUser.version + 1;
    const newUser = {
      ...oldUser,
      password: updatePasswordDto.newPassword,
      version: version,
      updatedAt: Number(Date.now())
    };

    const index = usersDb.findIndex((item) => item.id === id);
    usersDb[index] = newUser;

    delete newUser.password;
    return newUser;
  }

  remove(id: string) {
    this.validateUserId(id);
    const index = usersDb.findIndex((item) => item.id === id);
    usersDb.splice(index, 1);
    return 'User is found and deleted';
  }

  private validateUserId(id: string) {
    const user = usersDb.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('This user is not exist'); // 404
    }

    return user;
  }
}
