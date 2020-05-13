import { Entity, ObjectIdColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('hobby')
export class HobbyEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(type => UserEntity, user => user.friends)
  user: UserEntity;

}