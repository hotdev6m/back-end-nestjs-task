import {Entity, ObjectIdColumn, Column, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import { IsEmail } from 'class-validator';

import { HobbyEntity } from '../hobby/hobby.entity';

@Entity('user')
export class UserEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @OneToMany(type => HobbyEntity, hobby => hobby.user)
  hobbies: HobbyEntity[];

  @OneToMany(type => UserEntity, user => user.friends)
  friends: UserEntity[];
}