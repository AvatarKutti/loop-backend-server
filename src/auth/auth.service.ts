import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthLogInData, AuthRegResData } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    username: string,
    email: string,
    password: string,
  ): Promise<AuthRegResData> {
    try {
      // Hashing the user password
      const hassedPassword = await bcrypt.hash(password, 12);

      // Creating user object
      const user = {
        username: username,
        email: email,
        password: hassedPassword,
      };

      const res = await this.userRepository.save(user);

      if (!res) {
        throw new BadRequestException();
      }

      return { registered: true };
    } catch (error) {
      console.log(error);
      return { registered: false };
    }
  }

  async logUser(email: string, password: string): Promise<AuthLogInData> {
    try {
      const user = await this.userRepository.findOne({ email: email });

      if (!user) {
        throw new Error("User doesn't exist");
      }

      const passIsCorrect = await bcrypt.compare(password, user.password);

      if (!passIsCorrect) {
        throw new Error('Password is wrong');
      }

      const jwt = await this.jwtService.signAsync({ id: user.id });

      return {
        http_graphql_summit: jwt,
        user_ceredentials: user,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
