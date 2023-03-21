import axios from 'axios';
import { Params } from '@/api/manager';

export function getSubDomainList(params: Params) {
  return axios.get('/scan/subdomain', {
    params,
  });
}

export function getSubDomainTask(params: Params) {
  return axios.get('/collector/subdomain', {
    params,
  });
}

export function addSubDomainTask(params: any) {
  return axios.post('/collector/subdomain', params);
}

export function delSubDomainTask(params: any) {
  return axios.delete(`/collector/subdomain?CusName=${params}`);
}

export function delAllSubDomainTask() {
  return axios.delete('/collector/subdomain/all');
}

export function getSubDomainDetails(params: any) {
  return axios.get('/collector/subdomain/details', {
    params,
  });
}
