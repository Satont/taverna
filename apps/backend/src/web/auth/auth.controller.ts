import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { TwitchMakeAuthGuard } from './guards/twitch-auth.guard';
import { HelixUserData } from 'twitch';

@Controller('auth')
export class AuthController {
  @Get('twitch')
  @UseGuards(TwitchMakeAuthGuard)
  async getUserFromDiscordLogin(@Res() res: Response) {
    res.redirect('/');
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    (req as any).logout();

    res.redirect('/');
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  me(@Req() req: Request): HelixUserData {
    return req.user;
  }
}
