import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HobbyEntity } from './hobby.entity';
import { HobbyController } from './hobby.controller';
import { HobbyService } from './hobby.service';

@Module({
  imports: [TypeOrmModule.forFeature([HobbyEntity])],
  providers: [HobbyService],
  controllers: [
    HobbyController
  ],
  exports: [
    HobbyService
  ]
})
export class HobbyModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes({path: 'hobby', method: RequestMethod.GET}, {path: 'hobby', method: RequestMethod.PUT});
  }
}