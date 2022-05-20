import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShipmentModule } from './shipment/shipment.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Container } from './entities/Container';
import { Shipment } from './entities/Shipment';
import { TrackingSteps } from './entities/TrackingSteps';

config();


const SYNC:boolean = true;

const dbConfig: TypeOrmModuleOptions = {
  url: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: true,
  // },
  type: 'postgres',
  entities: [
    Container,
    Shipment,
    TrackingSteps
  ],
  synchronize: SYNC,
} as TypeOrmModuleOptions;

@Module({
  imports: [ShipmentModule,
    TypeOrmModule.forRoot(dbConfig),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
