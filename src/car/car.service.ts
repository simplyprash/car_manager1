import { HttpException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICar } from './interfaces/car.interface';
import { carDto } from './car.dto';
import { carUpdateDto} from './carupdate.dto';


@Injectable()
export class CarService {

    constructor(@InjectModel('Car') private readonly carModel: Model<ICar>) {}
    
    public async getCars(): Promise<carDto[]> {
        const cars = this.carModel.find().exec();
        
        return cars;
        
    }

    public async postCar(newcar) {
        const car = await new this.carModel(newcar);
        return car.save();
    }

    public async getCarById(id: number): Promise<carDto> {
        const car = await this.carModel.findOne({ id }).exec();
        if(!car ) {
            throw new HttpException('Not Found', 404);
        }

      
        return car;
    }

    public async deleteCarById(id: number): Promise<number> {
        const car = this.carModel.deleteOne({ id }).exec();
        if( (await car).deletedCount === 0 ) {
            throw new HttpException('Not Found', 404);
        }

        return 1;
    }

    public async putcarByid(id: number, carUpdateDto: carUpdateDto): Promise<carUpdateDto> {
        const filter = {id:id};
        const existingCar = await this.carModel.findOneAndUpdate(filter, carUpdateDto);
        if (!existingCar) {
            throw new NotFoundException(`Car #${id} not found`);
        }
        const car = await this.carModel.findOne({ id }).exec();
        return car;
    }

    public async getLogoImage(id:number){
        const car = await this.carModel.findOne({ id }).exec();
        return car.logo;
    }

    async saveImageAndGetURL(schemeName: string, logo): Promise<string> {
        // Convert to Base64 and save in MongoDB with schemeName as a key
        const logoBase64 = `data:${logo.mimetype};base64,${logo.buffer.toString('base64')}`;
        //const car = await new this.carModel(schemeName, logoBase64);

        const logoUrl = 'http://'+schemeName+'/logo';  
                      
        // Generate URL
        return logoUrl; // URL now uses schemeName
      }

    
}
