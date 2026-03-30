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
import { Review1Service } from './review1.service';
import { CreateReview1Dto } from './dto/create-review1.dto';
import { UpdateReview1Dto } from './dto/update-review1.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reviews') // Group the controller under "Reviews" in Swagger
@Controller('review1')
export class Review1Controller {
  constructor(private readonly review1Service: Review1Service) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Contract or reviewer not found.' })
  create(@Body() createReview1Dto: CreateReview1Dto) {
    return this.review1Service.create(createReview1Dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all reviews' })
  @ApiResponse({ status: 200, description: 'List of all reviews.' })
  findAll() {
    return this.review1Service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific review by ID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  findOne(@Param('id') id: string) {
    return this.review1Service.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific review by ID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  update(@Param('id') id: string, @Body() updateReview1Dto: UpdateReview1Dto) {
    return this.review1Service.update(+id, updateReview1Dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific review by ID' })
  @ApiResponse({
    status: 204,
    description: 'The review has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  remove(@Param('id') id: string) {
    return this.review1Service.remove(+id);
  }
}
