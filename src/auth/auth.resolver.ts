import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';
import { AuthLogInData, AuthRegResData } from './auth.dto';
import { AuthService } from './auth.service';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query((returns) => Int)
  users(): number {
    return 24;
  }

  @Mutation((returns) => AuthRegResData)
  async registerUser(
    @Args({ name: 'username' }) username: string,
    @Args({ name: 'email' }) email: string,
    @Args({ name: 'password' }) password: string,
  ): Promise<AuthRegResData> {
    return this.authService.registerUser(username, email, password);
  }

  @Mutation((returns) => AuthLogInData)
  async logUser(
    @Args({ name: 'email' }) email: string,
    @Args({ name: 'password' }) password: string,
  ): Promise<any> {
    return this.authService.logUser(email, password);
  }
}
