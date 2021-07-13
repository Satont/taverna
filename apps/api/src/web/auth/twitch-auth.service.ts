import { Injectable, UnauthorizedException } from '@nestjs/common';
import twitch from '../../twitch';

@Injectable()
export class AuthService {
  async findUser(id: string) {
    const user = twitch.bot.api.helix.users.getUserById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
