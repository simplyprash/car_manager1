import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/?directConnection=true'),
    CarModule,
  ],
})
export class AppModule {}
