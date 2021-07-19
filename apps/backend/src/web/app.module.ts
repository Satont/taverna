import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { EventsModule } from './events/events.module';
import { BotModule } from '../discord/bot.module';

@Module({
  imports: [BotModule, TeamModule, AuthModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
