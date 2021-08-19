import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Request } from 'express';
import twitch from '../../../twitch';

@Injectable()
export class IsInTeam implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;

    return twitch.channels?.some((c) => c.id === user?.id);
  }
}
