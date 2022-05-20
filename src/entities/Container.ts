import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shipment } from './Shipment';
import { TrackingSteps } from './TrackingSteps';

@Entity()
export class Container {
  constructor(id?: number) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', nullable: true, default: '' })
  name: string;

  @OneToMany(() => TrackingSteps, (ts) => ts.container)
  trackingSteps: TrackingSteps[];

  @ManyToOne(() => Shipment, (sp) => sp.containers)
  @JoinColumn()
  shipment?: Shipment;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
