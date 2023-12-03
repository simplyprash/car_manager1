import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logo, LogoWithouthId } from '../schemas/logo.schema';
@Injectable()
export class LogoRepository {
  constructor(@InjectModel(Logo.name) private logoModel: Model<Logo>) {}

  async findOne(schemeName: string): Promise<Logo | null> {
  	const filter = {schemeName:schemeName};
    return (await this.logoModel.findOne(filter).exec())?.toObject();
  }


  async addUpdateOne(logoData:LogoWithouthId){
    const name = logoData.schemeName;
    const filter = {schemeName:name};

        const existingLogo = await this.logoModel.findOneAndUpdate(filter, logoData);

        if (!existingLogo) {
           
          
            return (await new this.logoModel(logoData).save()).toObject();

        }else{
           const  logo = await this.logoModel.findOne(filter).exec();
           return (logo).toObject();
        }
  }
}
