import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Container } from './Container';

@Entity()
export class TrackingSteps {
  constructor(id?: number) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', nullable: true, default: '' })
  name: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  status: boolean;

  @Column({ type: 'number', nullable: true })
  containerId: number;

  @Column({ type: 'timestamp', nullable: true})
  completed_at: Date;

  @ManyToOne(() => Container, (ct) => ct.trackingSteps)
  @JoinColumn()
  container?: Container;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
