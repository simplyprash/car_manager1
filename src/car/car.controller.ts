import { Body,Res, Header, Req, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors, UploadedFile , StreamableFile  } from '@nestjs/common';
import { CarService } from './car.service';
import { carDto} from './car.dto';
import { carUpdateDto} from './carupdate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, writeFile} from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import {Request} from 'express';


@Controller('car')
export class CarController {
    constructor(private carService: CarService) {}

    @Get()
    async getCars() {
        return this.carService.getCars();
    }

    @Post()
    @UseInterceptors(FileInterceptor('logo'))
    async postCar(@UploadedFile() logo, @Body() car: carDto) {
        console.log(logo.buffer.toString('base64'));
        car['logo'] = "data:"+logo.mimetype+";base64,"+ logo.buffer.toString('base64'); 
        
        return this.carService.postCar(car);
    }

    @Get(':id')
    async getCarById(@Req() req: Request, @Param('id') id: number) {
        const data = await this.carService.getCarById(id).then(result => result);
        let logoUrl = '';   
        if (data.logo){
            const protocol = req.protocol;
            const host = req.get("Host");
            const originUrl = req.originalUrl;
            logoUrl = protocol +'://'+ host+originUrl+'/logo';  
        }else{
            logoUrl = 'NA';   
        }
               
        data.logo = logoUrl;   
     
        return data;    
        
        
    }

    @Delete(':id')
    async deleteCarById(@Param('id') id: number) {
        return this.carService.deleteCarById(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('logo'))
    async putCarById(@Req() req: Request, @Param('id') id: number, @Body() carUpdate: carUpdateDto, @UploadedFile() logo) {
           
        if(logo){
            carUpdate['logo'] = "data:"+logo.mimetype+";base64,"+ logo.buffer.toString('base64'); 

        }
          
        const existingCar = await this.carService.putcarByid(id, carUpdate);
        let logoUrl = '';   
        if (existingCar.logo){
            const protocol = req.protocol;
            const host = req.get("Host");
            const originUrl = req.originalUrl;
            logoUrl = protocol +'://'+ host+originUrl+'/logo';  
        }else{
            logoUrl = 'NA';   
        } 
        existingCar.logo = logoUrl;
        return existingCar;
    }


    @Get(':id/logo')
    @Header('Content-Type', 'image/png')
    async getLogo(
        @Res({ passthrough: true }) res: Response, @Param('id') id: number
    ): Promise<StreamableFile> {
        const carItem = await this.carService.getLogoImage(id).then(result => result);
        console.log(carItem);
        const b64Data = carItem;
        const type =  b64Data.split(';base64,')[0].split('data:')[1];
        const base64Image = b64Data.split(';base64,')[1];
        const imageBuffer =  Buffer.from(base64Image, 'base64');
   
        return new StreamableFile(imageBuffer);
    }



    
}
