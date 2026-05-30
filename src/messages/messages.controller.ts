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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Sender or receiver not found.' })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all messages, optionally filtered by sender or receiver',
  })
  @ApiResponse({ status: 200, description: 'List of messages.' })
  findAll(
    @Query('senderId') senderId?: string,
    @Query('receiverId') receiverId?: string,
  ) {
    return this.messagesService.findAll({ senderId, receiverId });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific message by ID' })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific message by ID' })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific message by ID' })
  @ApiResponse({
    status: 204,
    description: 'The message has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
