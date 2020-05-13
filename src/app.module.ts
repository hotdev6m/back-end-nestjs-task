import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { HobbyModule } from './hobby/hobby.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/',
      database: 'test-task',
      entities: [
        __dirname + '/**/**.entity{.ts,.js}',
      ],
      ssl: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }),
    UserModule,
    HobbyModule
  ],
  controllers: [
  ],
  providers: [
  ],
})
export class AppModule {}
