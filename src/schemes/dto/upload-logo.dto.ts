import { IsString } from 'class-validator';

export class UploadLogoDto {
  @IsString()
  schemeName: string;
	file: string;
	mimeType: string;
}
