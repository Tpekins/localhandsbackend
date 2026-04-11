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
import { ServiceassetService } from './serviceasset.service';
import { CreateServiceassetDto } from './dto/create-serviceasset.dto';
import { UpdateServiceassetDto } from './dto/update-serviceasset.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Service Assets') // Group the controller under "Service Assets" in Swagger
@Controller('serviceasset')
export class ServiceassetController {
  constructor(private readonly serviceassetService: ServiceassetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service asset' })
  @ApiResponse({
    status: 201,
    description: 'The service asset has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  create(@Body() createServiceassetDto: CreateServiceassetDto) {
    return this.serviceassetService.create(createServiceassetDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all service assets' })
  @ApiResponse({ status: 200, description: 'List of all service assets.' })
  findAll() {
    return this.serviceassetService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific service asset by ID' })
  @ApiResponse({
    status: 200,
    description: 'The service asset has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Service asset not found.' })
  findOne(@Param('id') id: string) {
    return this.serviceassetService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific service asset by ID' })
  @ApiResponse({
    status: 200,
    description: 'The service asset has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Service asset not found.' })
  update(
    @Param('id') id: string,
    @Body() updateServiceassetDto: UpdateServiceassetDto,
  ) {
    return this.serviceassetService.update(+id, updateServiceassetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific service asset by ID' })
  @ApiResponse({
    status: 204,
    description: 'The service asset has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Service asset not found.' })
  remove(@Param('id') id: string) {
    return this.serviceassetService.remove(+id);
  }
}
