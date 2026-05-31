import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from '../services/search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':model/:id')
  @ApiOperation({ summary: 'Search for an entity by ID' })
  @ApiResponse({ status: 200, description: 'Entity found successfully' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  async searchById(
    @Param('model') model: string,
    @Param('id', ParseIntPipe) id: number,
    @Query('include') include?: string,
  ) {
    let includeObj: Record<string, unknown> | undefined;
    if (include) {
      try {
        includeObj = JSON.parse(include) as Record<string, unknown>;
      } catch {
        includeObj = undefined;
      }
    }
    return this.searchService.searchById(model, id, includeObj);
  }
}
