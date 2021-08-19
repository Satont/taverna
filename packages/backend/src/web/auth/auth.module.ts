import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { TwitchStrategy } from './twitch.strategy';

@Module({
  imports: [PassportModule.register({ session: true }), HttpModule],
  providers: [TwitchStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
