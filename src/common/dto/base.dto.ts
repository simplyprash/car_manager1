import {ObjectId} from 'mongoose';

/**
 * Represents the basic infrastructure of data transfer object.
 */
export class BaseDto {
    /**
     * Object identificator.
     *
     * @example 0x61bcff9aa4ca3b2b8cb3dd8t
     */
    id?: ObjectId | string;

    /**
     * Object name.
     *
     * @example Some_name
     */
    name: string;
}