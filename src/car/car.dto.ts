import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class carDto {
    id: number;
    brand: string;
    color: string;
    model: string;
  	logo: string
}