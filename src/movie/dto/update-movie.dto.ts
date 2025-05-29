import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-mvoie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
