import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { HackathonService } from './hackathon.service.js';
import { CreateHackathonDto } from './dtos/create-hackathon.dto.js';
import { UpdateHackathonDto } from './dtos/update-hackathon.dto.js';

@Controller('hackathon')
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Post()
  @Roles(['ADMIN'])
  @ResponseMessage('Hackathon created successfully')
  async create(
    @Body() dto: CreateHackathonDto,
    @Session() session: { user: { id: string } },
  ) {
    return this.hackathonService.create(dto, session.user.id);
  }

  @Get()
  @ResponseMessage('Hackathons retrieved successfully')
  async findAll() {
    return this.hackathonService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Hackathon retrieved successfully')
  async findById(@Param('id') id: string) {
    return this.hackathonService.findById(id);
  }

  @Patch(':id')
  @Roles(['ADMIN'])
  @ResponseMessage('Hackathon updated successfully')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHackathonDto,
  ) {
    return this.hackathonService.update(id, dto);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  @ResponseMessage('Hackathon deleted successfully')
  async delete(@Param('id') id: string) {
    await this.hackathonService.delete(id);
    return null;
  }

  @Post(':id/join')
  @Roles(['PARTICIPANT'])
  @ResponseMessage('Successfully joined the hackathon')
  async join(
    @Param('id') id: string,
    @Session() session: { user: { id: string } },
  ) {
    return this.hackathonService.join(id, session.user.id);
  }
}
