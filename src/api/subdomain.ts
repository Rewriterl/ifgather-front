import axios from 'axios';
import { Params } from '@/api/manager';

export function getSubDomainList(params: Params) {
  return axios.get('/scan/subdomain', {
    params,
  });
}

export function getDomainList(params: Params) {
  return axios.get('/user/optlogs', {
    params,
  });
}
