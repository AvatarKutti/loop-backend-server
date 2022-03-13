import { Resolver, Query } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => String)
  users(): String {
    return 'Hello world';
  }
}
