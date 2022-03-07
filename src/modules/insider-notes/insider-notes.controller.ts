import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InsiderNotesService } from './insider-notes.service';
import { CreateInsiderNoteDto } from './dto/create-insider-note.dto';
import { UpdateInsiderNoteDto } from './dto/update-insider-note.dto';

@Controller('insider-notes')
export class InsiderNotesController {
  constructor(private readonly insiderNotesService: InsiderNotesService) {}

  @Post()
  create(@Body() createInsiderNoteDto: CreateInsiderNoteDto) {
    return this.insiderNotesService.create(createInsiderNoteDto);
  }

  @Get()
  findAll() {
    return this.insiderNotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insiderNotesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsiderNoteDto: UpdateInsiderNoteDto) {
    return this.insiderNotesService.update(+id, updateInsiderNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insiderNotesService.remove(+id);
  }
}
