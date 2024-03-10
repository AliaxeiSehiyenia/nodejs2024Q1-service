import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DB } from '../database/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    if (!(createUserDto.login && createUserDto.password)) {
      throw new BadRequestException('Invalid data');
    }

    const newUser = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Number(Date.now()),
      updatedAt: Number(Date.now())
    };
    DB.users.push(newUser);

    const { ...rest } = newUser;
    delete rest.password;
    return rest;
  }

  findAll() {
    return DB.users;
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
      throw new BadRequestException('Invalid data');
    }

    const oldUser = this.validateUserId(id);
    if (updatePasswordDto.oldPassword !== oldUser.password) {
      throw new ForbiddenException('Old password is wrong');
    }

    const version = oldUser.version + 1;
    const newUser = {
      ...oldUser,
      password: updatePasswordDto.newPassword,
      version: version,
      updatedAt: Number(Date.now())
    };

    const index = DB.users.findIndex((item) => item.id === id);
    DB.users[index] = newUser;

    delete newUser.password;
    return newUser;
  }

  remove(id: string) {
    this.validateUserId(id);
    const index = DB.users.findIndex((item) => item.id === id);
    DB.users.splice(index, 1);
    return 'User is found and deleted';
  }

  private validateUserId(id: string) {
    const user = DB.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('This user is not exist');
    }

    return user;
  }
}
