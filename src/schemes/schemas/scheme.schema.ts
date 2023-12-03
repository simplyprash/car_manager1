import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';

export const SchemeSchema = new mongoose.Schema({
	schemeName:String,
    assetName: String,
    auditor: String,
    assetLocation: String,
    assetType: String,
    typeOfEnergy: String,
    maxCapacity: Number,
    dateOfFirstOperation: Number,
    assetId: String,
    consumedEnergy: Number,
    complianceThreshold: Number,
    timestamp: Number,
    energyAmount: Number,
    timestampStart: Number,
    timestampEnd: Number,
    logoUrl: String,
});

export class Scheme {
  @Field(() => String)
  _id: mongoose.Schema.Types.ObjectId
  @Prop()
  body: string
  
}



export const SchemeFSchema = SchemaFactory.createForClass(Scheme)