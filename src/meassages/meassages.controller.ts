import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MeassagesService } from './meassages.service';
import { CreateMeassageDto } from './dto/create-meassage.dto';
import { UpdateMeassageDto } from './dto/update-meassage.dto';

@Controller('meassages')
export class MeassagesController {
  constructor(private readonly meassagesService: MeassagesService) {}

  @Post()
  create(@Body() createMeassageDto: CreateMeassageDto) {
    return this.meassagesService.create(createMeassageDto);
  }

  @Get()
  findAll() {
    return this.meassagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meassagesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeassageDto: UpdateMeassageDto,
  ) {
    return this.meassagesService.update(+id, updateMeassageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meassagesService.remove(+id);
  }
}
