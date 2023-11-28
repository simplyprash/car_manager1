import { IsString } from 'class-validator';

export class UploadLogoDto {
  @IsString()
  name: string;
}
