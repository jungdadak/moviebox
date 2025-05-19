import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-mvoie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  getManyMovies(title?: string) {
    return this.movieRepository.find();
  }

  async getMovieById(id: number) {
    return await this.movieRepository.findOne({
      where: {
        id,
      },
    });
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    return await this.movieRepository.save(createMovieDto);
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.movieRepository.update(
      {
        id,
      },
      updateMovieDto,
    );

    return this.movieRepository.findOne({
      where: { id },
    });
  }

  async deleteMovie(id: number) {
    const movie = this.movieRepository.findOne({
      where: { id },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.movieRepository.delete(id);
    return id;
  }
}
