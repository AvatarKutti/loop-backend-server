import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';

@ObjectType()
export class AuthRegResData {
  @Field((type) => Boolean)
  registered: boolean;
}

@ObjectType()
export class AuthLogInData {
  @Field()
  http_graphql_summit: string;
  @Field((type) => User)
  user_ceredentials: User;
}
