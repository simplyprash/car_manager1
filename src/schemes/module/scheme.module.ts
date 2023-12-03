import { Module } from '@nestjs/common';
import { SchemeController } from '../controller/scheme.controller';
import { SchemeService } from '../service/scheme.service';
import { LogoService } from '../service/logo.service';
import { LogoRepository } from '../repository/logo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemeSchema } from '../schemas/scheme.schema';
import { LogoSchema } from '../schemas/logo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Scheme',
        schema: SchemeSchema,
      },
      {
        name: 'Logo',
        schema: LogoSchema,
      },
    ])
    
  ],
  controllers: [SchemeController],
  providers: [SchemeService, LogoService, LogoRepository]
})
export class SchemeModule {}