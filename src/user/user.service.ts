import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, getMongoRepository, DeleteResult } from 'typeorm';

import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { validate } from 'class-validator';

import { UserEntity } from './user.entity';
import { UserResponse } from './user.interface';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUser(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne(id);
    return this.buildUserResponse(user);
  }

  async assignFriend(id: string, friendId: string): Promise<any> {
    const friend = await this.userRepository.findOne(friendId);
    const user = await this.userRepository.findOne({ where: id, relations: ['friends'] });
    if (!friend || !user) {
      const errors = {friendId: 'User or friend is not exist!'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    if (!user.friends) {
      user.friends = [];
    }

    user.friends.push(friend);
    await this.userRepository.save(user);

    return user;
  }
  

  async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async myFriends(id: string): Promise<any> {
    return await this.userRepository.findOne(id);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {

    // check uniqueness of username/email
    const {username, email} = dto;
    const userRepository = getMongoRepository(UserEntity);
    const qb = await userRepository.find({
      where: {
        $or: [
            { username: username },
            { email: email }
          ]
      }
    });

    if (qb.length) {
      const errors = {username: 'Username and email must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);

    }

    // create new user
    let newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.hobbies = [];
    newUser.friends = [];

    const errors = await validate(newUser);
    if (errors.length > 0) {
      const _errors = {username: 'Userinput is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);

    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUserResponse(savedUser);
    }

  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOne(id);
    delete toUpdate.username;
    delete toUpdate.email;

    let updated = Object.assign(toUpdate, dto);
    return await this.userRepository.save(updated);
  }

  private buildUserResponse(user: UserEntity) {
    if (user) {
      const userRO = {
        id: user._id,
        username: user.username,
        email: user.email
      };

      return {user: userRO};
    }

    return {user: user};
  }
}
