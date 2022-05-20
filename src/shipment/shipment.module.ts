import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from 'src/entities/Shipment';
import { Container } from 'src/entities/Container';
import { TrackingSteps } from 'src/entities/TrackingSteps';

@Module({
  providers: [ShipmentService],
  controllers: [ShipmentController],
  imports: [TypeOrmModule.forFeature([TrackingSteps,Shipment, Container])],

})
export class ShipmentModule {}
