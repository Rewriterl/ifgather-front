import axios from 'axios';
import { Params } from '@/api/manager';

export function getWebinfoList(params: Params) {
  return axios.get('/scan/webinfo', {
    params,
  });
}

export function getWebinfoTree(params: Params) {
  return axios.get('/scan/webinfo/tree', {
    params,
  });
}
