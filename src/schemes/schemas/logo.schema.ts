import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, ObjectId } from 'mongoose';

export type LogoDocument = HydratedDocument<Logo>;

@Schema()
export class Logo {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: String, required: true })
  file: string;

  @Prop({ type: String, required: true })
  schemeName: string;

  @Prop({ type: String, required: true })
  mimeType: string;
}

export const LogoSchema = SchemaFactory.createForClass(Logo);
export type LogoWithouthId = Omit<Logo, '_id'>;