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
import { AvailabiltyService } from './availabilty.service';
import { CreateAvailabiltyDto } from './dto/create-availabilty.dto';
import { UpdateAvailabiltyDto } from './dto/update-availabilty.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Availabilities') // Group the controller under "Availabilities" in Swagger
@Controller('availabilty')
export class AvailabiltyController {
  constructor(private readonly availabiltyService: AvailabiltyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new availability' })
  @ApiResponse({
    status: 201,
    description: 'The availability has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Provider not found.' })
  create(@Body() createAvailabiltyDto: CreateAvailabiltyDto) {
    return this.availabiltyService.create(createAvailabiltyDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all availabilities' })
  @ApiResponse({ status: 200, description: 'List of all availabilities.' })
  findAll() {
    return this.availabiltyService.findAll();
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
    return this.availabiltyService.findOne(+id);
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
    @Body() updateAvailabiltyDto: UpdateAvailabiltyDto,
  ) {
    return this.availabiltyService.update(+id, updateAvailabiltyDto);
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
    return this.availabiltyService.remove(+id);
  }
}
