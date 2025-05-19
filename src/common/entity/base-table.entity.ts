import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class BaseTableEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
