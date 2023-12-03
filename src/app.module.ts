import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { LogoModule } from './logo/logo.module';
import * as Joi from 'joi';
import { SchemeModule } from './schemes/scheme.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/?directConnection=true'),
	MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: 'mongodb://127.0.0.1:27017/?directConnection=true',
      }),
      inject: [ConfigService],
    }),
    CarModule,
    SchemeModule,
	LogoModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/upload/'),
    	serveStaticOptions: { index: false },
    }),

  ],
  

})
export class AppModule {}
