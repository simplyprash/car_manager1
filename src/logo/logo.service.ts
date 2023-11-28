import { Injectable, NotFoundException } from '@nestjs/common';
import { Logo } from './logo.schema';
import { LogoRepository } from './logo.repository';
import { UploadLogoDto } from './upload-logo.dto';
@Injectable()
export class LogoService {
  constructor(private readonly logoRepository: LogoRepository) {}

  async create(dto: UploadLogoDto, file: Express.Multer.File): Promise<Logo> {
    return await this.logoRepository.create({
      name: dto.name,
      file: file.buffer,
      mimeType: file.mimetype,
    });
  }

  async findAll(): Promise<Logo[]> {
    return await this.logoRepository.findAll();
  }

  async findOne(id: string): Promise<Logo> {
    const logo = await this.logoRepository.findOne(id);
    if (!logo) {
      throw new NotFoundException(`Logo with id ${id} not found`);
    }
    return logo;
  }

  async deleteOne(id: string): Promise<Logo> {
    const logo = await this.logoRepository.deleteOne(id);
    if (!logo) {
      throw new NotFoundException(`Logo with id ${id} not found`);
    }
    return logo;
  }

  async updateOne(
    id: string,
    dto: UploadLogoDto,
    file?: Express.Multer.File,
  ): Promise<Logo> {
    const logo = await this.logoRepository.updateOne(id, {
      name: dto.name,
      file: file?.buffer,
      mimeType: file?.mimetype,
    });
    if (!logo) {
      throw new NotFoundException(`Logo with id ${id} not found`);
    }
    return logo;
  }
}
