import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-mvoie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '../director/entity/director.entity';
import { Genre } from '../genre/entity/genre.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  getManyMovies(title?: string) {
    if (title) {
      return this.movieRepository.findAndCount({
        where: {
          title: Like(`%${title}%`),
        },
        relations: ['director', 'genres'],
      });
    }
    return this.movieRepository.find({
      relations: ['director', 'genres'],
    });
  }

  async getMovieById(id: number) {
    return await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail', 'director'],
    });
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const director = await this.directorRepository.findOne({
      where: { id: createMovieDto.directorId },
    });

    if (!director) {
      throw new NotFoundException('Director does not exists');
    }

    const genres = await this.genreRepository.find({
      where: {
        id: In(createMovieDto.genreIds),
      },
    });

    if (genres.length !== createMovieDto.genreIds.length) {
      throw new NotFoundException(
        `There is Genre does not exists ${genres.map((genre) => genre.id).join(', ')}`,
      );
    }
    return await this.movieRepository.save({
      title: createMovieDto.title,
      detail: { detail: createMovieDto.detail },
      director,
      genres,
    });
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail'],
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const { genreIds, directorId, detail, ...movieRest } = updateMovieDto;

    let newDirector;

    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: {
          id: directorId,
        },
      });

      if (!director) {
        throw new NotFoundException('Director does not exists');
      }

      newDirector = director;
    }

    let newGenres;

    if (genreIds) {
      const genres = await this.genreRepository.find({
        where: {
          id: In(genreIds),
        },
      });
      if (genreIds.length !== updateMovieDto.genreIds.length) {
        throw new NotFoundException(
          `Genre does not exists ${genres.map((genre) => genre.id).join(', ')}`,
        );
      }
      newGenres = genres;
    }

    const movieUpdateFields = {
      ...movieRest,
      ...(newDirector && { director: newDirector }),
    };
    await this.movieRepository.update(
      {
        id,
      },
      movieUpdateFields,
    );

    if (detail) {
      await this.movieDetailRepository.update(
        {
          id: movie.detail.id,
        },
        {
          detail,
        },
      );
    }

    const newMovie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director'],
    });

    newMovie.genres = newGenres;
    await this.movieRepository.save(newMovie);
    return this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail', 'director', 'genres'],
    });
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.movieRepository.delete(id);
    await this.movieDetailRepository.delete(movie.detail.id);
    return id;
  }
}
