import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchemeDto } from './dto/scheme.dto';
import { SchemeSchema, SchemeDocument } from './schemas/scheme.schema';

@Injectable()
export class SchemeService {
  constructor(@InjectModel('Scheme') private schemeModel: Model<SchemeDocument>) {}

  async createOrUpdateScheme(schemeName: string, schemeData: SchemeDto): Promise<SchemeDto> {
    const updatedScheme = await this.schemeModel.findOneAndUpdate(
      { schemeName },
      { $set: schemeData },
      { new: true, upsert: true }
    ).exec();
  
    return this.toSchemeDto(updatedScheme);
  }
  
  async getSchemeBySchemeName(schemeName: string): Promise<SchemeDto | null> {
    const scheme = await this.schemeModel.findOne({ schemeName }).exec();
    return scheme ? this.toSchemeDto(scheme) : null;
  }
  
  private toSchemeDto(document: SchemeDocument): SchemeDto {
    const { name, ...dtoFields } = document.toObject({ versionKey: false });
    return { ...dtoFields } as SchemeDto;
  }
  
  }

