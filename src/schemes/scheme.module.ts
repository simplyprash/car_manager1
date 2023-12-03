import { Module } from '@nestjs/common';
import { SchemeController } from './scheme.controller';
import { SchemeService } from './scheme.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemeSchema } from './schemas/scheme.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Scheme',
        schema: SchemeSchema,
      },
    ])
    
  ],
  controllers: [SchemeController],
  providers: [SchemeService]
})
export class SchemeModule {}
