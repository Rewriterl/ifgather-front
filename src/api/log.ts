import axios from 'axios';
import { Params } from '@/api/manager';

export function getLoginLogs(params: Params) {
  return axios.get('/user/llogs', {
    params,
  });
}

export function getOptLogs(params: Params) {
  return axios.get('/user/optlogs', {
    params,
  });
}
