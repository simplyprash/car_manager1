import {ApiBearerAuth, ApiParam, ApiResponse, ApiTags, ApiQuery} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Header, HttpCode, Param, Post, Put} from '@nestjs/common';
import {SchemeService} from './scheme.service';
import { SchemeDto } from './dto/scheme.dto';

@Controller('scheme')
export class SchemeController {
  constructor(private readonly schemeService: SchemeService) {}

  @Put('/:schemeName')
  async updateScheme(@Param('schemeName') schemeName: string, @Body() schemeDto: SchemeDto): Promise<SchemeDto> {
    return this.schemeService.createOrUpdateScheme(schemeName, schemeDto);
  }

  @Get('/:schemeName')
  async getSchemeByName(@Param('schemeName') schemeName: string): Promise<SchemeDto> {
    return this.schemeService.getSchemeBySchemeName(schemeName);
  }
}