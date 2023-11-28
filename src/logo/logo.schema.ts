import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, ObjectId } from 'mongoose';

export type LogoDocument = HydratedDocument<Logo>;

@Schema()
export class Logo {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: Buffer, required: true })
  file: Buffer;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  mimeType: string;
}

export const LogoSchema = SchemaFactory.createForClass(Logo);
export type LogoWithouthId = Omit<Logo, '_id'>;
