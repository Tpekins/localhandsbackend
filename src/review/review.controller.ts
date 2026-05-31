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
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Contract or reviewer not found.' })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all reviews, optionally filtered by service or reviewer',
  })
  @ApiQuery({
    name: 'serviceId',
    required: false,
    description: 'Filter reviews by service ID (via contract → service order)',
  })
  @ApiQuery({
    name: 'reviewerId',
    required: false,
    description: 'Filter reviews by reviewer (provider) ID',
  })
  @ApiResponse({ status: 200, description: 'List of all reviews.' })
  findAll(
    @Query('serviceId') serviceId?: string,
    @Query('reviewerId') reviewerId?: string,
  ) {
    return this.reviewService.findAll({ serviceId, reviewerId });
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
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific review by ID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
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
    return this.reviewService.remove(+id);
  }
}
