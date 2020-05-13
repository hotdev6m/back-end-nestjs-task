import { Controller, Param, Get, Post, Body, Delete } from '@nestjs/common';

import { CreateUserDto } from './dto';
import { UserService } from './user.service';
import { UserResponse } from './user.interface';
import { DeleteResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('')
  public async findAll(): Promise<any> {
    return await this.userService.findAll();
  }

  @Get(':id')
  public async find(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.findUser(id);
  }

  @Post(':id/assign_friend')
  public async assignFriend(@Param('id') id: string, @Body('friendId') friendId: string) {
    return await this.userService.assignFriend(id, friendId);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.delete(id);
  }

  @Post()
  async create(@Body('user') userData: CreateUserDto): Promise<UserResponse> {
    return this.userService.create(userData);
  }

  @Get(':id/friends')
  public async myFriends(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.myFriends(id);
  }
}
