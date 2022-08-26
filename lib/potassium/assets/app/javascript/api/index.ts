import axios, { type AxiosRequestTransformer, type AxiosResponseTransformer } from 'axios';
import { camelizeKeys } from 'humps';
import decamelizeKeys from '../utils/decamelizer';

const api = axios.create({
  transformRequest: [
    (data: any) => decamelizeKeys(data),
    ...(axios.defaults.transformRequest as AxiosRequestTransformer[]),
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosResponseTransformer[]),
    (data: any) => camelizeKeys(data),
  ],
});

export default api;
