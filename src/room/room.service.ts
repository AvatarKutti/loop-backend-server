import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, Room } from '../entities/room.entity';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class RoomService {
  pubSub = new PubSub();
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async createRoom(roomname: string, owner: string): Promise<Room> {
    const createdAt = Date.now();
    const joinId = nanoid(10);

    const room = {
      roomname,
      owner,
      joinId,
      createdAt,
      messages: [],
    };

    const resRoom = await this.roomRepository.save(room);

    if (!resRoom) {
      throw new Error('Something went wrong');
    }

    return resRoom;
  }

  async discardRoom(roomId: string): Promise<any> {
    try {
      const deletedRoom = await this.roomRepository.delete({ joinId: roomId });

      if (!deletedRoom) {
        return false;
      }

      return true;
    } catch (error) {
      throw new Error('Something went wrong');
    }
  }
}
