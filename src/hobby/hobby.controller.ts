
import { Controller, Param, Get, Post, Body, Delete } from '@nestjs/common';

import { DeleteResult } from 'typeorm';
import { HobbyService } from './hobby.service';
import { HobbyResponse } from './hobby.interface';
import { CreateHobbyDto } from './dto/hobby.dto';

@Controller('hobby')
export class HobbyController {
  constructor(
    private readonly HobbyService: HobbyService,
  ) {}

  @Get('')
  public async findAll(): Promise<any> {
    return await this.HobbyService.findAll();
  }

  @Get(':id')
  public async find(@Param('id') id: string): Promise<HobbyResponse> {
    return await this.HobbyService.findHobby(id);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.HobbyService.delete(id);
  }

  @Post()
  async create(@Body('hobby') HobbyData: CreateHobbyDto): Promise<HobbyResponse> {
    return this.HobbyService.create(HobbyData);
  }

}
