import axios from 'axios';
import { Params } from '@/api/manager';

export function getPortList(params: Params) {
  return axios.get('/scan/port', {
    params,
  });
}

export function getPortScanTask(params: Params) {
  return axios.get('/collector/portscan', {
    params,
  });
}
