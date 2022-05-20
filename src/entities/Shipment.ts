import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Container } from './Container';

@Entity()
export class Shipment {
  
  constructor(id?: number) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', nullable: true, default: '' })
  origin: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  destination: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  description: string;

  @OneToMany(() => Container, (ct) => ct.shipment)
  containers?: Container[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
