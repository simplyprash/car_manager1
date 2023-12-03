/**
 * Represents an entity of Scheme.
 */

/**
 * Fields which can be change rather or on create
 */
export interface StaticScheme {
    assetId?:string
    assetName?:string
    auditor?:string;
    assetLocation?:string;
    assetType?:string;
    typeOfEnergy?:string;
    maxCapacity?:number;
    dateOfFirstOperation?:number;
}

/**
 * Fields which can be dynamic update
 */
export interface DynamicScheme {
    //Dynamic properties
    consumedEnergy?:number;
    complianceThreshold?:number;
    timestamp?:number;
    energyAmount?:number;
    timestampStart?:number;
    timestampEnd?:number;
}

/**
 * Scheme entity
 */
export interface Scheme extends DynamicScheme,StaticScheme {
}
