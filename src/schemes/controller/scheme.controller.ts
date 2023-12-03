import {ApiBearerAuth, ApiParam, ApiResponse, ApiTags, ApiQuery} from '@nestjs/swagger';
import { Body,Res, Header, Req, Get, Controller, HttpCode, Delete, Param, Post, Put, Query, UseInterceptors, UploadedFile , StreamableFile  } from '@nestjs/common';
import {SchemeService} from '../service/scheme.service';
import {SchemeDto} from '../dto/scheme.dto';
import {Request} from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogoService} from '../service/logo.service';
import { UploadLogoDto } from '../dto/upload-logo.dto';
import { join } from 'path';
@Controller('scheme')
export class SchemeController {

    constructor(protected readonly _schemeService:SchemeService, protected readonly _logoService:LogoService){
    }

    //certification Scheme API.

    /**
     * Provides example value of certification scheme name.
     */
    private static readonly exampleCertificationSchemeName: string = 'CMS70 GreenHydrogen 11-2021';

    /**
     * Get existing scheme.
     *
     * @param schemeName name of target scheme.
     * @returns SchemeDto instance.
     */
    

    @Get('/:schemeName')
    async findByName(@Param('schemeName') schemeName: string) {

        return await this._schemeService.getScheme(schemeName).then(result => result);
    }

    /**
     * Edits/Create existing scheme.
     *
     * @param schemeName name of target scheme.
     * @param newRequest Data for updating/creating.
     * @returns SchemeDto instance.
     */

    @Put(':schemeName')
    @UseInterceptors(FileInterceptor('logo'))
    async updateScheme( @Req() req: Request, @Param('schemeName') schemeName: string, @UploadedFile() logo, @Body() newRequest:SchemeDto) {
       
        if(logo){
           const logoObject = {
                'file' : "data:"+logo.mimetype+";base64,"+ logo.buffer.toString('base64'),
                'mimeType' : logo.mimetype,
                'schemeName' : schemeName,  
            }
            
         const logoUrl = await this._logoService.addUpdateOne(logoObject, req).then(result => result);
         
            newRequest['logoUrl'] = logoUrl;
        }else{
            newRequest['logoUrl'] = 'NA';
        }
       
        return this._schemeService.updateScheme(schemeName, newRequest).then(result => result);
    }


    @Get(':schemeName/logo')
    @Header('Content-Type', 'image/png')
    async getLogo(
        @Res({ passthrough: true }) res: Response, @Param('schemeName') schemeName: string
    ): Promise<StreamableFile> {
        const logoItem = await this._logoService.getLogoImage(schemeName).then(result => result);
        const b64Data = logoItem.file;
        const type =  b64Data.split(';base64,')[0].split('data:')[1];
        const base64Image = b64Data.split(';base64,')[1];
        const imageBuffer =  Buffer.from(base64Image, 'base64');
   
        return new StreamableFile(imageBuffer);
    }

   
}
