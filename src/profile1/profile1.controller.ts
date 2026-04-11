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
import { Profile1Service } from './profile1.service';
import { CreateProfile1Dto } from './dto/create-profile1.dto';
import { UpdateProfile1Dto } from './dto/update-profile1.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Profiles') // Group the controller under "Profiles" in Swagger
@Controller('profile1')
export class Profile1Controller {
  constructor(private readonly profile1Service: Profile1Service) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({
    status: 201,
    description: 'The profile has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  create(@Body() createProfile1Dto: CreateProfile1Dto) {
    return this.profile1Service.create(createProfile1Dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all profiles' })
  @ApiResponse({ status: 200, description: 'List of all profiles.' })
  findAll() {
    return this.profile1Service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'The profile has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  findOne(@Param('id') id: string) {
    return this.profile1Service.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'The profile has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  update(
    @Param('id') id: string,
    @Body() updateProfile1Dto: UpdateProfile1Dto,
  ) {
    return this.profile1Service.update(+id, updateProfile1Dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific profile by ID' })
  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  remove(@Param('id') id: string) {
    return this.profile1Service.remove(+id);
  }
}
