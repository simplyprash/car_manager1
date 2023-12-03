import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { Logo } from '../schemas/logo.schema';
import { LogoRepository } from '../repository/logo.repository';
import { UploadLogoDto } from '../dto/upload-logo.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class LogoService {
	constructor(@Inject(REQUEST) private readonly request: Request, private readonly logoRepository: LogoRepository) {}

	async addUpdateOne(dto: UploadLogoDto, request){
		const logo = await this.logoRepository.addUpdateOne({
			schemeName: dto.schemeName,
			file: dto.file,
			mimeType: dto.mimeType,
		});

		if (!logo) {
			throw new NotFoundException(`Logo not found`);
		}

		let logoUrl:string;   
		if (logo){
			const protocol = request.protocol;
			const host = request.get("Host");
			const originUrl = request.originalUrl;
			logoUrl = protocol +'://'+ host+originUrl+'/logo';  
		}else{
			logoUrl = 'NA';   
		} 
		return logoUrl;
	}


	public async getLogoImage(schemeName:string){
        const logo = await this.logoRepository.findOne(schemeName);
        return logo;
    }

}