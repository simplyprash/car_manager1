/**
 * Represents an infrastructure of scheme dto.
 */
import {BaseDto} from '../../common/dto/base.dto';
import {Scheme} from '../interfaces/scheme.interface';

/**
 * Represents an infrastructure of the scheme data transfer object.
 */
export class SchemeDto extends BaseDto implements Scheme {
    /**
     * Scheme assetName.
     *
     * @example 'Hydrogen asset'
     */
    assetName?: string;

    /**
     * Scheme auditor.
     *
     * @example 0x2467636BEa0F3c2441227eeDBfFaC59f11D54a80
     * An Ethereum address is a 42-character hexadecimal
     * address derived from the last 20 bytes of the public key controlling
     * the account with 0x appended in front.
     */
    auditor?: string;

    /**
     * AssetLocation.
     *
     * @example some_location
     */
    assetLocation?: string;

    /**
     * assetType.
     *
     * @example Electrolyzer
     */
    assetType?: string;

    /**
     * typeOfEnergy.
     *
     * @example Hydrogen
     */
    typeOfEnergy?: string;

    /**
     * maxCapacity.
     *
     * @example 0
     */
    maxCapacity?: number;

    /**
     * dateOfFirstOperation.
     *
     * @example 3
     */
    dateOfFirstOperation?: number;

    /**
     * assetId.
     *
     * @example 626920aedcb8392edfad459c
     */
    assetId?: string;

    /**
     * consumedEnergy.
     *
     * @example 0
     */
    consumedEnergy?: number;

    /**
     * Represents the threshold value for greenhouse gas emissions in terms of CO2 equivalent
     *
     * @example 28200
     */
    complianceThreshold?: number;

    /**
     * timestamp.
     *
     * @example 0
     */
    timestamp?: number;

    /**
     * energyAmount.
     *
     * @example 0
     */
    energyAmount?: number;

    /**
     * timestampStart.
     *
     * @example 0
     */
    timestampStart?: number;

    /**
     * timestampEnd.
     *
     * @example 0
     */
    timestampEnd?: number;

    /**
     * Mapping from {@link Scheme} to {@link SchemeDto}.
     *
     * @param scheme Target asset.
     * @returns {@link SchemeDto} instance.
     */
    static from(scheme: Scheme): SchemeDto {
        const schemeDto = new SchemeDto();

        if (!scheme) {
            return schemeDto;
        }
        schemeDto.assetName = scheme.assetName;
        schemeDto.assetId = scheme.assetId;
        schemeDto.auditor = scheme.auditor;
        schemeDto.assetLocation = scheme.assetLocation;
        schemeDto.assetType = scheme.assetType;
        schemeDto.typeOfEnergy = scheme.typeOfEnergy;
        schemeDto.maxCapacity = scheme.maxCapacity;
        schemeDto.dateOfFirstOperation = scheme.dateOfFirstOperation;
        schemeDto.consumedEnergy = scheme.consumedEnergy;
        schemeDto.complianceThreshold = scheme.complianceThreshold;
        schemeDto.timestamp = scheme.timestamp;
        schemeDto.energyAmount = scheme.energyAmount;
        schemeDto.timestampStart = scheme.timestampStart;
        schemeDto.timestampEnd = scheme.timestampEnd;

        return schemeDto;
    }
}
