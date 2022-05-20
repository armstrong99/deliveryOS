import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Container } from 'src/entities/Container';
import { Shipment } from 'src/entities/Shipment';
import { TrackingSteps } from 'src/entities/TrackingSteps';
import { IRes } from 'src/interface/global';
import { Repository } from 'typeorm';
import {
  ETRACKING_STEPS,
  IContainers,
  IShipments,
  IUpdateTracking,
} from './shipment.dto';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepo: Repository<Shipment>,
    @InjectRepository(Container)
    private containerRepo: Repository<Container>,
    @InjectRepository(TrackingSteps)
    private trackingStepsRepo: Repository<TrackingSteps>,
  ) {}

  async createShipment(dt: IShipments): Promise<IRes<Shipment>> {
    try {
      let result: Shipment = await this.shipmentRepo.save({
        ...dt,
      });

      // save containers
      var savedContainers: IContainers[] = [];

      dt.containers.map(async (container) => {
        let savedContainer = await this.containerRepo.save({
          ...container,
          shipment: result,
        });

        savedContainer.tracking_steps.map(async (trackingStep) => {
          let savedTrackingSteps = await this.trackingStepsRepo.save({
            ...trackingStep,
            container: savedContainer,
            containerId: savedContainer.id,
          });

          return savedTrackingSteps;
        });

        savedContainers.push(savedContainer);
        // console.log("sd", savedContainer);
      });

      return {
        message:
          'Your shipment was successfully saved, thanks for trusting DeliverOS',
        data: result,
        status: true,
        statusCode: 201,
      };
    } catch (e) {
      return {
        message: (e as Error).message,
        status: false,
        data: null,
        statusCode: 424,
      };
    }
  }

  async updateTracking(dt: IUpdateTracking): Promise<IRes<null>> {
    try {
      let foundTrackStep = await this.trackingStepsRepo.findOne({
        where: {
          containerId: dt.containerId,
          name: dt.name,
        },
      });

      if (!foundTrackStep)
        throw new Error(
          'Update failed as no container/shipment with id provided can be found',
        );

      //validate Not-Started
      if (dt.name === ETRACKING_STEPS.NotStarted && dt.status) {
        //console.log(foundTrackStep, 'fts', dt);

        await this.trackingStepsRepo.update(
          {
            containerId: dt.containerId,
            name: ETRACKING_STEPS.InProgress,
          },
          {
            status: true,
            completed_at: null,
          },
        );
      }

      //validate IN-PROGRESS
      if (dt.name === ETRACKING_STEPS.InProgress && dt.status) {
        let findPrevStep = await this.trackingStepsRepo.findOne({
          where: {
            containerId: dt.containerId,
            name: ETRACKING_STEPS.NotStarted,
          },
        });

        if (!findPrevStep.completed_at) {
          throw new Error(
            `Sorry we can't update this track-step as the pre-step(${ETRACKING_STEPS.NotStarted}) is not marked as completed.`,
          );
        } else
          await this.trackingStepsRepo.update(
            {
              containerId: dt.containerId,
              name: ETRACKING_STEPS.Complete,
            },
            {
              status: true,
              completed_at: null,
            },
          );
      }

      //validate Completed
      if (dt.name === ETRACKING_STEPS.Complete && dt.status) {
        let findPrevStep = await this.trackingStepsRepo.findOne({
          where: {
            containerId: dt.containerId,
            name: ETRACKING_STEPS.InProgress,
          },
        });

        if (!findPrevStep.completed_at) {
          throw new Error(
            `Sorry we can't update this track-step as the pre-step(${ETRACKING_STEPS.InProgress}) is not marked as completed.`,
          );
        }
      }

      //save if all validation pass
       await this.trackingStepsRepo.update(
        {
          containerId: dt.containerId,
          name: dt.name,
        },
        {
          status: true,
          completed_at: dt.status ? new Date() : null,
        },
      );

      return {
        message: `Tracking step(${dt.name}) was successfully updated`,
        data: null,
        status: true,
        statusCode: 200,
      };
    } catch (e) {
      return {
        data: null,
        message: (e as Error).message,
        status: false,
        statusCode: 424,
      };
    }
  }

  async getShipmentByIdWithAllContainers(
    shipmentId: number,
  ): Promise<IRes<Container[]>> {
    try {
      let foundCountainers = await this.shipmentRepo.findOne({
        where: {
          id: shipmentId,
        },
        relations: ['containers', 'containers.trackingSteps'],
      });

      //console.log(foundCountainers);

      return {
        data: foundCountainers.containers,
        message: `Containers for shipment with id,${shipmentId},is sucessfully retrieved..`,
        status: true,
        statusCode: 201,
      };
    } catch (e) {
      return {
        data: null,
        message: (e as Error).message,
        status: false,
        statusCode: 424,
      };
    }
  }

  async getContainerByIdWithShipment(
    containerId: number,
  ): Promise<IRes<Container>> {
    try {
      let foundCountainers = await this.containerRepo.findOne({
        where: {
          id: containerId,
        },
        relations: ['shipment', 'trackingSteps'],
      });

      return {
        data: foundCountainers,
        message: `Shipment details for container with id,${containerId},is sucessfully retrieved.`,
        status: true,
        statusCode: 201,
      };
    } catch (e) {
      return {
        data: null,
        message: (e as Error).message,
        status: false,
        statusCode: 424,
      };
    }
  }
}
