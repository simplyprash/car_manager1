import {ApiBearerAuth, ApiParam, ApiResponse, ApiTags, ApiQuery} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Header, HttpCode, Param, Post, Put} from '@nestjs/common';
import {SwaggerBearerAuth} from '../../auth/swagger/swagger-bearer-auth';
import {SchemeService} from '../service/scheme.service';
import {SchemeDto} from '../dto/scheme.dto';
import {Scopes} from '../../auth/permissions/scopes.decorator';
import {CertificationSchemeStatusDto} from '../dto/certification-scheme-status.dto';
import {AuthenticatedUser} from '../../auth/user/authenticated-user.decorator';
import {IUserInfo} from '../../auth/user/user-info';

/**
 * Represents Rest API for {@link Scheme}.
 */
@ApiTags('Scheme')
@ApiResponse({status: 400, description: 'Bad request'})
@ApiResponse({status: 401, description: 'Unauthorized access to the resources.'})
@ApiResponse({status: 500, description: 'Internal server error. Please try again later.'})
@ApiBearerAuth(SwaggerBearerAuth.NAME)
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
    @Scopes({scopes: ['cec_certification_scheme_read']})
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
    @Scopes({scopes: ['cec_certification_scheme_write']})
    @Put('/:schemeName')
    async updateScheme(@Param('schemeName') schemeName: string, @Body() newRequest: SchemeDto): Promise<SchemeDto> {
        return this._schemeService.updateScheme(schemeName, newRequest).then(scheme => SchemeDto.from(scheme));
    }

    /**
     * Get names of schemes
     *
     * @param userInfo Provides user info.
     * @returns Array of names.
     */
    @Get()
    @Scopes({scopes: ['cec_certification_scheme_read']})
    async getListOfSchemeNames(@AuthenticatedUser() userInfo: IUserInfo): Promise<string[]> {
        return this._schemeService.getListOfSchemeNames(userInfo.realm_access.roles).then(names => names);
    }

    /**
     * Gets scheme status.
     *
     * @param schemeName name of target scheme.
     * @returns Promise of scheme status.
     */
    @ApiParam({
        name: 'schemeName',
        type: 'string',
        description: 'Scheme name.',
        example: SchemeController.exampleCertificationSchemeName,
    })
    @Header('Content-type', 'application/json')
    @Scopes({scopes: ['cec_certification_scheme_status_read']})
    @Get('/:schemeName/status')
    async getSchemeStatus(@Param('schemeName') schemeName: string): Promise<CertificationSchemeStatusDto> {
        return this._schemeService.getSchemeStatus(schemeName);
    }

    /**
     * Approves scheme.
     *
     * @param schemeName name of target scheme.
     * @returns Promise of an empty response.
     */
    @ApiParam({
        name: 'schemeName',
        type: 'string',
        description: 'Scheme name.',
        example: SchemeController.exampleCertificationSchemeName,
    })
    @Header('Content-type', 'application/json')
    @Scopes({scopes: ['cec_certification_scheme_approval_write']})
    @Put('/:schemeName/approve')
    async approveScheme(@Param('schemeName') schemeName: string): Promise<void> {
        return this._schemeService.approveScheme(schemeName);
    }

    /**
     * Withdraws scheme.
     *
     * @param schemeName name of target scheme.
     * @returns Promise of an empty response.
     */
    @ApiParam({
        name: 'schemeName',
        type: 'string',
        description: 'Scheme name.',
        example: SchemeController.exampleCertificationSchemeName,
    })
    @Header('Content-type', 'application/json')
    @Scopes({scopes: ['cec_certification_scheme_approval_write']})
    @Put('/:schemeName/withdraw')
    async withdrawScheme(@Param('schemeName') schemeName: string): Promise<void> {
        return this._schemeService.withdrawScheme(schemeName);
    }
}
