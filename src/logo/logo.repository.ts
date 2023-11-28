import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logo, LogoWithouthId } from './logo.schema';
@Injectable()
export class LogoRepository {
  constructor(@InjectModel(Logo.name) private logoModel: Model<Logo>) {}

  async create(obj: LogoWithouthId): Promise<Logo> {
    return (await new this.logoModel(obj).save()).toObject();
  }

  async findAll(): Promise<Logo[]> {
    return (await this.logoModel.find().select('-file').exec()).map((logo) =>
      logo.toObject(),
    );
  }

  async findOne(id: string): Promise<Logo | null> {
    return (await this.logoModel.findById(id).exec())?.toObject();
  }

  async deleteOne(id: string): Promise<Logo | null> {
    return (
      await this.logoModel.findByIdAndDelete(id, { new: true }).exec()
    )?.toObject();
  }

  async updateOne(
    id: string,
    obj: Partial<LogoWithouthId>,
  ): Promise<Logo | null> {
    return (
      await this.logoModel.findByIdAndUpdate(id, obj, { new: true }).exec()
    )?.toObject();
  }
}
