import { Body, Controller, Get, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { Request, Response } from 'express';
import { IRes } from 'src/interface/global';
import { Shipment } from 'src/entities/Shipment';
import { IShipments, IUpdateTracking } from './shipment.dto';
import { Container } from 'src/entities/Container';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post('create-shipment')
  async createShipment(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createShipment: IShipments,
  ) {
    let result: IRes<Shipment> = await this.shipmentService.createShipment(
      createShipment,
    );

    if (!result.status) res.status(result.statusCode).send(result);
    else res.send(result);
  }

  @Put('container/update-tracking')
  async UpdateTracking(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateTrackingDt: IUpdateTracking,
  ) {
    let result: IRes<Shipment> = await this.shipmentService.updateTracking(
      updateTrackingDt,
    );

    if (!result.status) res.status(result.statusCode).send(result);
    else res.send(result);
  }

  @Get("get-all-containers")
  async getAllContanaiers(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: { shipmentId: number }
  ) {

    let result: IRes<Container[]> = await this.shipmentService.getShipmentByIdWithAllContainers(
        query.shipmentId,
      );
  
      if (!result.status) res.status(result.statusCode).send(result);
      else res.send(result);
  }

  @Get("container")
  async getContainer(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: { containerId: number }
  ) {

    let result: IRes<Container> = await this.shipmentService.getContainerByIdWithShipment(
        query.containerId,
      );
  
      if (!result.status) res.status(result.statusCode).send(result);
      else res.send(result);
  }
}
