import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTableEntity } from '../../common/entity/base-table.entity';
import { Exclude } from 'class-transformer';

export enum Role {
  admin,
  paidUser,
  user,
}

@Entity()
export class User extends BaseTableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true }) //toClassOnly: 인바운드
  password: string;

  @Column({
    enum: Role,
    default: Role.user,
  })
  role: Role;
}
