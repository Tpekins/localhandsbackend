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
import { ProposalService } from './proposal.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Proposals')
@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new proposal' })
  @ApiResponse({
    status: 201,
    description: 'The proposal has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Service or provider not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createProposalDto: CreateProposalDto) {
    return this.proposalService.create(createProposalDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all proposals, optionally filtered by provider',
  })
  @ApiResponse({ status: 200, description: 'List of all proposals.' })
  findAll(@Query('providerId') providerId?: string) {
    return this.proposalService.findAll({ providerId });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific proposal by ID' })
  @ApiResponse({
    status: 200,
    description: 'The proposal has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Proposal not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.proposalService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific proposal by ID' })
  @ApiResponse({
    status: 200,
    description: 'The proposal has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Proposal not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
  ) {
    return this.proposalService.update(+id, updateProposalDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific proposal by ID' })
  @ApiResponse({
    status: 204,
    description: 'The proposal has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Proposal not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.proposalService.remove(+id);
  }
}
