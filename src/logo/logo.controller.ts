import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  Res,
  StreamableFile,
  Put,
  Delete,
} from '@nestjs/common';
import { LogoService } from './logo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UploadLogoDto } from './upload-logo.dto';
import { Response } from 'express';
import { MIME_TYPE_TO_EXTENSION } from 'src/logo/mime-type-to-extension';

@Controller('/logos')
export class LogoController {
  constructor(private readonly logoService: LogoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({
            fileType: /^(image\/(png|jpeg|gif|bmp|webp|svg\+xml))$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: UploadLogoDto,
  ) {
    const { file: _, ...rest } = await this.logoService.create(dto, file);
    return { message: 'File uploaded successfully', data: rest };
  }

  @Get()
  async findAll() {
    return await this.logoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { file: _, ...rest } = await this.logoService.findOne(id);
    return rest;
  }

  @Get(':id/download')
  async downloadOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const logo = await this.logoService.findOne(id);
    res.set({
      'Content-Type': logo.mimeType,
      'Content-Disposition': `attachment; filename=${logo.name}.${
        MIME_TYPE_TO_EXTENSION[logo.mimeType] ?? ''
      }`,
    });
    return new StreamableFile(Buffer.from(logo.file.buffer));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateOne(
    @Param('id') id: string,
    @Body() dto: UploadLogoDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({
            fileType: /^(image\/(png|jpeg|gif|bmp|webp))$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { file: _, ...rest } = await this.logoService.updateOne(
      id,
      dto,
      file,
    );
    return { message: 'File updated successfully', data: rest };
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    await this.logoService.deleteOne(id);
    return { message: 'File deleted successfully' };
  }
}
