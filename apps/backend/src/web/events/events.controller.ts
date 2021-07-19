import { Controller, Get, UseGuards, Query, Post, Param, Req, Res, Body, Patch } from '@nestjs/common';
import { IsInTeam } from '../auth/guards/isInTeam.guard';
import { EventsService } from './events.service';
import { EventsList } from './validations/EventsList';
import { Request, Response } from 'express';
import { CreateEvent } from './validations/CreateEvent';

@Controller('/events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get('/')
  @UseGuards(IsInTeam)
  async root(@Query() query: EventsList, @Res() res: Response) {
    const data = await this.service.getEventsList(query);
    res.setHeader('x-total', data.total);
    res.status(201).send(data.events);
  }

  @Get('/upcoming')
  upComing() {
    return this.service.getUpcomingEvents();
  }

  @Get('/:id')
  @UseGuards(IsInTeam)
  getOne(@Param('id') id: string) {
    return this.service.getEvent(id);
  }

  @Post('/:id/join')
  @UseGuards(IsInTeam)
  joinEvent(@Param('id') id: string, @Req() { user }: Request) {
    return this.service.joinInEvent(id, user.id);
  }

  @Post('/:id/part')
  @UseGuards(IsInTeam)
  partEvent(@Param('id') id: string, @Req() { user }: Request) {
    return this.service.partFromEvent(id, user.id);
  }

  @Post('/')
  @UseGuards(IsInTeam)
  create(@Body() body: CreateEvent, @Req() { user }: Request) {
    return this.service.create(body, user?.id);
  }

  @Patch('/')
  @UseGuards(IsInTeam)
  update(@Body() body: CreateEvent, @Req() { user }: Request) {
    return this.service.update(body, user?.id);
  }
}
