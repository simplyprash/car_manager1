import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CarService } from './car.service';
import { carDto} from './car.dto';

@Controller('car')
export class CarController {
    constructor(private carService: CarService) {}

    @Get()
    async getCars() {
        return this.carService.getCars();
    }

    @Post()
    async postCar(@Body() car: carDto) {
        return this.carService.postCar(car);
    }

    @Get(':id')
    async getCarById(@Param('id') id: number) {
        return this.carService.getCarById(id);
    }

    @Delete(':id')
    async deleteCarById(@Param('id') id: number) {
        return this.carService.deleteCarById(id);
    }

    @Put(':id')
    async putCarById(@Param('id') id: number, @Query() Query) {
        const propertyName = Query.propertyName;
        const propertyValue = Query.propertyValue;
        return this.carService.putcarByid(id, propertyName, propertyValue);
    }

    
}
