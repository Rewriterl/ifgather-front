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

export function addPortScanTask(params: any) {
  return axios.post('/collector/portscan', params);
}

export function delPortScanTask(param: any) {
  return axios.delete(`/collector/portscan?CusName=${param}`);
}

export function delAllPortScanTask() {
  return axios.delete('/collector/portscan/all');
}

export function getPortScanDetails(params: any) {
  return axios.get('/collector/portscan/details', {
    params,
  });
}
