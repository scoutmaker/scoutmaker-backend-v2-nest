import { Injectable } from '@nestjs/common';
import { CreateInsiderNoteDto } from './dto/create-insider-note.dto';
import { UpdateInsiderNoteDto } from './dto/update-insider-note.dto';

@Injectable()
export class InsiderNotesService {
  create(createInsiderNoteDto: CreateInsiderNoteDto) {
    return 'This action adds a new insiderNote';
  }

  findAll() {
    return `This action returns all insiderNotes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} insiderNote`;
  }

  update(id: number, updateInsiderNoteDto: UpdateInsiderNoteDto) {
    return `This action updates a #${id} insiderNote`;
  }

  remove(id: number) {
    return `This action removes a #${id} insiderNote`;
  }
}
