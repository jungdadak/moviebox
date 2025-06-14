import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entity/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  create(createGenreDto: CreateGenreDto) {
    return this.genreRepository.save(createGenreDto);
  }

  findAll() {
    return this.genreRepository.find();
  }

  findOne(id: number) {
    return this.genreRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreRepository.findOne({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException('not existing genre');
    }

    await this.genreRepository.update(
      {
        id,
      },
      {
        ...updateGenreDto,
      },
    );

    return await this.genreRepository.findOne({
      where: { id },
    });
  }

  remove(id: number) {
    return this.genreRepository.delete(id);
  }
}
