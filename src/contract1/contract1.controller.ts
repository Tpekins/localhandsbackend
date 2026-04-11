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
import { Contract1Service } from './contract1.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateContract1Dto } from './dto/create-contract1.dto';
import { UpdateContract1Dto } from './dto/update-contract1.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contracts') // Group the controller under "Contracts" in Swagger
@Controller('contract1')
export class Contract1Controller {
  constructor(private readonly contract1Service: Contract1Service) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({
    status: 201,
    description: 'The contract has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Service order not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createContract1Dto: CreateContract1Dto) {
    return this.contract1Service.create(createContract1Dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all contracts' })
  @ApiResponse({ status: 200, description: 'List of all contracts.' })
  findAll() {
    return this.contract1Service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific contract by ID' })
  @ApiResponse({
    status: 200,
    description: 'The contract has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Contract not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.contract1Service.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific contract by ID' })
  @ApiResponse({
    status: 200,
    description: 'The contract has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Contract not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateContract1Dto: UpdateContract1Dto,
  ) {
    return this.contract1Service.update(+id, updateContract1Dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific contract by ID' })
  @ApiResponse({
    status: 204,
    description: 'The contract has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Contract not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.contract1Service.remove(+id);
  }
}
