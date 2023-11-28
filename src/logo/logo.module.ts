import { Module } from '@nestjs/common';
import { LogoController } from './logo.controller';
import { LogoRepository } from './logo.repository';
import { LogoService } from './logo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Logo, LogoSchema } from './logo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Logo.name, schema: LogoSchema }]),
  ],
  controllers: [LogoController],
  providers: [LogoRepository, LogoService],
})
export class LogoModule {}
