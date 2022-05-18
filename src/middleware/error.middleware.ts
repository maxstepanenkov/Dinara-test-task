import { INext } from "../interface/INext.interface";
import { IRequest } from "../interface/IRequest.interface";
import { IResponse } from "../interface/IResponse.interface";
import { ApiError } from '../exception/api.error';

export default function(err: any, req: IRequest, res: IResponse, next: INext): IResponse {
  console.log(err)
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Unhandled error' });
}