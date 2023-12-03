import {ApiBearerAuth, ApiParam, ApiResponse, ApiTags, ApiQuery} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Header, HttpCode, Param, Post, Put} from '@nestjs/common';
import {SchemeService} from '../service/scheme.service';
import {SchemeDto} from '../dto/scheme.dto';


@Controller('scheme')
export class SchemeController {

    constructor(protected readonly _schemeService:SchemeService){
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
    @ApiParam({
        name: 'schemeName',
        type: 'string',
        description: 'Scheme name.',
        example: SchemeController.exampleCertificationSchemeName,
    })
    @Get('/:schemeName')
    async findByName(@Param('schemeName') schemeName: string): Promise<SchemeDto> {
        return this._schemeService.getSchemes(schemeName).then(scheme => SchemeDto.from(scheme));
    }

    /**
     * Edits/Create existing scheme.
     *
     * @param schemeName name of target scheme.
     * @param newRequest Data for updating/creating.
     * @returns SchemeDto instance.
     */
    @ApiParam({
        name: 'schemeName',
        type: 'string',
        description: 'Scheme name.',
        example: SchemeController.exampleCertificationSchemeName,
    })
    @Header('Content-type', 'application/json')
    @Put('/:schemeName')
    async updateScheme(@Param('schemeName') schemeName: string, @Body() newRequest: SchemeDto): Promise<SchemeDto> {
        return this._schemeService.updateScheme(schemeName, newRequest).then(scheme => SchemeDto.from(scheme));
    }

   
}
