import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field((type) => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  username: string;

  @Column()
  password: string;
}
