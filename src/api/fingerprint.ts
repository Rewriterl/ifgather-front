import axios from 'axios';
import { Params } from '@/api/manager';

export function getBanalyzeList(params: Params) {
  return axios.get('/collector/banalyze', {
    params,
  });
}

export function getBanalyzeDetails(key: string) {
  return axios.get(`/collector/details?key=${key}`);
}

export function getBanalyzeTask(params: Params) {
  return axios.get('/collector/banalyze/scan', {
    params,
  });
}

export function batchUploadBanalyze(data: any) {
  return axios.post('/collector/banalyzes', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function delAllBanalyze() {
  return axios.delete('/collector/banalyze/all');
}

export function delBanalyze(key: string) {
  return axios.delete(`/collector/banalyze?key=${key}`);
}

export function addBanalyze(data: any) {
  return axios.post('/collector/banalyze', data);
}

export function scanBanalyze(data: any) {
  return axios.get('/collector/banalyze/scan', {
    params: data,
  });
}
