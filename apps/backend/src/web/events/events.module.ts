import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { BotModule } from '../../discord/bot.module';

@Module({
  imports: [BotModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
