import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, getMongoRepository, DeleteResult } from 'typeorm';

import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { validate } from 'class-validator';

import { HobbyEntity } from './hobby.entity';
import { HobbyResponse } from './hobby.interface';
import { CreateHobbyDto } from './dto/hobby.dto';

@Injectable()
export class HobbyService {
  constructor(
    @InjectRepository(HobbyEntity)
    private readonly HobbyRepository: MongoRepository<HobbyEntity>
  ) {}

  async findAll(): Promise<HobbyEntity[]> {
    return this.HobbyRepository.find();
  }

  async findHobby(id: string): Promise<HobbyResponse> {
    const Hobby = await this.HobbyRepository.findOne({ _id: id });
    return this.buildHobbyResponse(Hobby);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.HobbyRepository.delete({ _id: id });
  }

  async myFriends(id: string): Promise<any> {
    return await this.HobbyRepository.findOne({_id: id});
  }

  async create(dto: CreateHobbyDto): Promise<HobbyResponse> {

    // check uniqueness of Hobbyname/email
    const {title, description} = dto;
    const HobbyRepository = getMongoRepository(HobbyEntity);
    const qb = await HobbyRepository.find({
      where: {
        $or: [
            { title: title },
            { description: description }
          ]
      }
    });

    if (qb.length) {
      const errors = {title: 'Hobby title and email must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    // create new Hobby
    let newHobby = new HobbyEntity();
    newHobby.title = title;
    newHobby.description = description;

    const errors = await validate(newHobby);
    if (errors.length > 0) {
      const _errors = {Hobbyname: 'Hobbyinput is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);

    } else {
      const savedHobby = await this.HobbyRepository.save(newHobby);
      return this.buildHobbyResponse(savedHobby);
    }

  }

  private buildHobbyResponse(hobby: HobbyEntity): HobbyResponse {
    if (hobby) {
      const HobbyRO = {
        id: hobby._id,
        title: hobby.title,
        description: hobby.description
      };

      return {data: HobbyRO};
    }

    return {data: hobby};
  }
}
