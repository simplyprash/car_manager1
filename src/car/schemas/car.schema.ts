import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';

export const CarSchema = new mongoose.Schema({
    id: Number,
    brand: String,
    color: String,
    model: String,
    logo:  String
});

export class Car {
  @Field(() => String)
  _id: mongoose.Schema.Types.ObjectId
  @Prop()
  @Field(() => String, { description: 'id' })
  body: string

  
}

export const CarFSchema = SchemaFactory.createForClass(Car)