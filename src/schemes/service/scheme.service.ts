import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Scheme } from '../interfaces/scheme.interfaces';
import { SchemeDto } from '../dto/scheme.dto';
import { SchemeUpdateDto} from '../dto/schemeUpdate.dto';

@Injectable()

export class SchemeService {
	constructor(@InjectModel('Scheme') private readonly schemeModel: Model<Scheme>,) {}



   public async getScheme(schemeName: string): Promise<SchemeUpdateDto> {
        const scheme = await this.schemeModel.findOne({ schemeName }).exec();
        if(!scheme ) {
            throw new HttpException('Not Found', 404);
        }

      
        return scheme;
    }

  async updateScheme(schemeName, SchemeUpdateDto){

  	    const filter = {schemeName:schemeName};
        const existingScheme = await this.schemeModel.findOneAndUpdate(filter, SchemeUpdateDto);

        if (!existingScheme) {
        	  SchemeUpdateDto.schemeName = schemeName;
        	
            const scheme = await new this.schemeModel(SchemeUpdateDto);
            return scheme.save();

        }else{
           const  scheme = await this.schemeModel.findOne({ schemeName }).exec();
           return scheme;
        }

        	
        
        
  }


}