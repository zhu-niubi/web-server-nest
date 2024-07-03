import { User } from './../users/schemas/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user)
      throw new HttpException(
        'Wrong username or password!🙅‍♂️',
        HttpStatus.FORBIDDEN,
      );

    const isUser = await user.comparePassword(pass);
    return isUser ? user.toJSON() : null;
  }
  async login(loginInfo: User) {
    const payload = {
      username: loginInfo.username,
      id: loginInfo._id?.toString(),
      roles: loginInfo.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
