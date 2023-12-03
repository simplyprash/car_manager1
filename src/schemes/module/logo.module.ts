import { Module } from '@nestjs/common';
import { LogoRepository } from '../repository/logo.repository';
import { LogoService } from '../service/logo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Logo, LogoSchema } from '../schemas/logo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Logo', schema: LogoSchema }]),
  ],
  controllers: [],
  providers: [LogoRepository, LogoService],
})
export class LogoModule {}
