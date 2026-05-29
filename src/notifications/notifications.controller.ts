import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'The notification has been successfully created.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all notifications, optionally filtered by user' })
  @ApiResponse({ status: 200, description: 'List of notifications.' })
  findAll(
    @Query('userId') userId?: string,
    @Query('read') read?: string,
  ) {
    return this.notificationsService.findAll({ userId, read });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific notification by ID' })
  @ApiResponse({ status: 200, description: 'The notification has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific notification by ID' })
  @ApiResponse({ status: 200, description: 'The notification has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific notification by ID' })
  @ApiResponse({ status: 204, description: 'The notification has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
