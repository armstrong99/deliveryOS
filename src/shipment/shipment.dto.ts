import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Container } from 'src/entities/Container';

export enum ETRACKING_STEPS {
  NotStarted = 'Not Started',
  Complete = 'Complete',
  InProgress = 'In-Progress',
}

export class ITrackingSteps {
  @IsEnum(ETRACKING_STEPS) name: ETRACKING_STEPS;
  @IsBoolean() status: boolean;
 @IsOptional() @IsDate() completed_at: Date|null;
 @IsOptional() container: Container;
 @IsOptional() @IsNumber() id?: number;
}

export class IContainers {
  @IsString() name: string;
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ITrackingSteps)
  tracking_steps: ITrackingSteps[];
  @IsOptional() @IsNumber() id?: number;
}

export class IShipments {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IContainers)
  containers: IContainers[];
  @IsOptional() @IsNumber() id?: number;
  @IsString() origin: string;
  @IsString() destination: string;
  @IsString() description: string;
}


export class IUpdateTracking {
  @IsNumber() containerId:number
  @IsEnum(ETRACKING_STEPS)name: ETRACKING_STEPS
  @IsBoolean() status: boolean
}
