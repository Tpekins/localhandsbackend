import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServicepackageService } from './servicepackage.service';
import { CreateServicepackageDto } from './dto/create-servicepackage.dto';
import { UpdateServicepackageDto } from './dto/update-servicepackage.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Service Packages') // Group the controller under "Service Packages" in Swagger
@Controller('servicepackage')
export class ServicepackageController {
  constructor(private readonly servicepackageService: ServicepackageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service package' })
  @ApiResponse({
    status: 201,
    description: 'The service package has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Provider not found.' })
  create(@Body() createServicepackageDto: CreateServicepackageDto) {
    return this.servicepackageService.create(createServicepackageDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all service packages' })
  @ApiResponse({ status: 200, description: 'List of all service packages.' })
  findAll() {
    return this.servicepackageService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific service package by ID' })
  @ApiResponse({
    status: 200,
    description: 'The service package has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Service package not found.' })
  findOne(@Param('id') id: string) {
    return this.servicepackageService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific service package by ID' })
  @ApiResponse({
    status: 200,
    description: 'The service package has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Service package not found.' })
  update(
    @Param('id') id: string,
    @Body() updateServicepackageDto: UpdateServicepackageDto,
  ) {
    return this.servicepackageService.update(+id, updateServicepackageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific service package by ID' })
  @ApiResponse({
    status: 204,
    description: 'The service package has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Service package not found.' })
  remove(@Param('id') id: string) {
    return this.servicepackageService.remove(+id);
  }
}
