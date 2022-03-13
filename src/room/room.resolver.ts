import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { Message, Room } from '../entities/room.entity';
import { RoomService } from './room.service';

// Resolver of Room

@Resolver((of) => Room)
export class RoomResolver {
  // Initialising the pubsub instance. The pubub instance needs to be the same for it to work so move the create message function from room service to roomResolver
  pubSub = new PubSub();
  constructor(
    private roomService: RoomService,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  // Every resolver needs atleast one query else it would throw an error

  @Query((returns) => String)
  helloRoom(): String {
    return 'This is room route';
  }

  // This mutation creates a room

  @Mutation((returns) => Room)
  async createRoom(
    @Args({ name: 'roomname' }) roomname: string,
    @Args({ name: 'owner' }) owner: string,
  ): Promise<Room> {
    return this.roomService.createRoom(roomname, owner);
  }

  // This deletes a room

  @Mutation((returns) => Boolean)
  async discardRoom(@Args({ name: 'roomId' }) roomId: string): Promise<any> {
    return this.roomService.discardRoom(roomId);
  }

  // Subscribes to messsages socket

  @Subscription((returns) => Message, {
    filter: (payload, variables) => payload.joinId === variables.joinId,
  })
  messages(@Args('joinId') joinId: string) {
    return this.pubSub.asyncIterator('messages');
  }

  // This mutation creates a messages and publishes the message in messages socket

  @Mutation((returns) => Boolean)
  async createMessage(
    @Args({ name: 'author' }) author: string,
    @Args({ name: 'content' }) content: string,
    @Args({ name: 'joinId' }) joinId: string,
  ): Promise<Boolean> {
    try {
      const time = Date.now();
      const id = nanoid();

      const message = {
        id,
        author,
        content,
        time,
      };

      const room = await this.roomRepository.findOne({ joinId: joinId });

      room.messages.push(message);

      const updatedRoom = await this.roomRepository.save(room);

      this.pubSub.publish('messages', {
        messages: message,
        joinId: joinId,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
