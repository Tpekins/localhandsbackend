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
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Availabilities')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new availability' })
  @ApiResponse({
    status: 201,
    description: 'The availability has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Provider not found.' })
  create(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.availabilityService.create(createAvailabilityDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all availabilities' })
  @ApiResponse({ status: 200, description: 'List of all availabilities.' })
  findAll() {
    return this.availabilityService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific availability by ID' })
  @ApiResponse({
    status: 200,
    description: 'The availability has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Availability not found.' })
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific availability by ID' })
  @ApiResponse({
    status: 200,
    description: 'The availability has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Availability not found.' })
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(+id, updateAvailabilityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific availability by ID' })
  @ApiResponse({
    status: 204,
    description: 'The availability has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Availability not found.' })
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(+id);
  }
}
