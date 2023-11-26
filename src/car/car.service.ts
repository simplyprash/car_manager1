import { HttpException, Injectable } from '@nestjs/common';
import { Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICar } from './interfaces/car.interface';
import { carDto } from './car.dto';


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
        const car = this.carModel.findOne({ id }).exec();
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

    public async putcarByid(id: number, propertyName: string, propertyValue: string): Promise<any> {
        
    }

    
}
