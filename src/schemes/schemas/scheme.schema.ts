import * as mongoose from 'mongoose';

export const SchemeSchema = new mongoose.Schema({
  schemeName: { type: String, required: true, unique: true },
  assetId: { type: String, required: false },
  assetName: { type: String, required: false },
  auditor: { type: String, required: false },
  assetLocation: { type: String, required: false },
  assetType: { type: String, required: false },
  typeOfEnergy: { type: String, required: false },
  maxCapacity: { type: Number, required: false },
  dateOfFirstOperation: { type: Number, required: false },
  consumedEnergy: { type: Number, required: false },
  complianceThreshold: { type: Number, required: false },
  timestamp: { type: Number, required: false },
  energyAmount: { type: Number, required: false },
  timestampStart: { type: Number, required: false },
  timestampEnd: { type: Number, required: false },
}, { timestamps: true });

export interface SchemeDocument extends mongoose.Document {
  schemeName: string;
  name?: string;
  assetName?: string;
  auditor?: string;
  assetLocation?: string;
  assetType?: string;
  typeOfEnergy?: string;
  maxCapacity?: number;
  dateOfFirstOperation?: number;
  assetId?: string;
  consumedEnergy?: number;
  complianceThreshold?: number;
  timestamp?: number;
  energyAmount?: number;
  timestampStart?: number;
  timestampEnd?: number;
  // Define other fields as necessary
}
