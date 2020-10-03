import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import { logger } from './logger.helper';

export interface Context {
    tiktok: null;
}

export const getHeaders = async (req:Http2ServerRequest|any,res:Http2ServerResponse|any):Promise<Context|null> => {
    return null;
}