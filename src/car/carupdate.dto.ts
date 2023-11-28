import { PartialType } from '@nestjs/mapped-types';
import { carDto } from './car.dto';
export class carUpdateDto extends PartialType(carDto) {}