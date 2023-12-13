import {SchemeDto} from '../../src/schemes/dto/scheme.dto';

export const certSchemeName = 'TEST_SCHEME_' + Date.now().toString();


export const schemeMock: SchemeDto = {
    assetName: 'Hydrogen asset',
    auditor: '0x2467636BEa0F3c2441227eeDBfFaC59f11D54a80',
    assetLocation: 'some_location',
    assetType: 'Electrolyzer',
    typeOfEnergy: 'hydrogen',
    maxCapacity: 0,
    dateOfFirstOperation: 3,
    assetId: '626920aedcb8392edfad459c',
    consumedEnergy: 0,
    timestamp: 0,
    energyAmount: 0,
    timestampStart: 0,
    timestampEnd: 0,
    complianceThreshold: 28200,
    name: 'Signal hydrgen counter',
};
