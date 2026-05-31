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
import { ServiceorderService } from './serviceorder.service';
import { CreateServiceorderDto } from './dto/create-serviceorder.dto';
import { UpdateServiceorderDto } from './dto/update-serviceorder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Service Orders') // Group the controller under "Service Orders" in Swagger
@Controller('serviceorder')
export class ServiceorderController {
  constructor(private readonly serviceorderService: ServiceorderService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service order' })
  @ApiResponse({
    status: 201,
    description: 'The service order has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Service or client not found.' })
  create(@Body() createServiceorderDto: CreateServiceorderDto) {
    return this.serviceorderService.create(createServiceorderDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Retrieve all service orders, optionally filtered by status or client',
  })
  @ApiResponse({ status: 200, description: 'List of all service orders.' })
  findAll(
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.serviceorderService.findAll({ status, clientId });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific service order by ID' })
  @ApiResponse({
    status: 200,
    description: 'The service order has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Service order not found.' })
  findOne(@Param('id') id: string) {
    return this.serviceorderService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific service order by ID' })
  @ApiResponse({
    status: 200,
    description: 'The service order has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Service order not found.' })
  update(
    @Param('id') id: string,
    @Body() updateServiceorderDto: UpdateServiceorderDto,
  ) {
    return this.serviceorderService.update(+id, updateServiceorderDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific service order by ID' })
  @ApiResponse({
    status: 204,
    description: 'The service order has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Service order not found.' })
  remove(@Param('id') id: string) {
    return this.serviceorderService.remove(+id);
  }
}
