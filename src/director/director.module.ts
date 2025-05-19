import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { Director } from './entity/director.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DirectorController],
  providers: [DirectorService],
  imports: [TypeOrmModule.forFeature([Director])],
})
export class DirectorModule {}
