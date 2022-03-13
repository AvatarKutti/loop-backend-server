import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
export class Message {
  @Field()
  @Column()
  id: string;

  @Column()
  @Field()
  author: string;

  @Column()
  @Field()
  content: string;

  @Column()
  @Field()
  time: number;
}

@ObjectType()
@Entity('rooms')
export class Room extends BaseEntity {
  @Field((type) => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column({ unique: true })
  joinId: string;

  @Field()
  @Column()
  roomname: string;

  @Field()
  @Column()
  owner: string;

  @Field((type) => [Message], { nullable: true })
  @Column()
  messages: Message[];

  @Column()
  @Field()
  createdAt: number;
}
