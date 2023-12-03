import { PartialType } from '@nestjs/mapped-types';
import { SchemeDto } from '../dto/scheme.dto';
export class SchemeUpdateDto extends PartialType(SchemeDto) {}