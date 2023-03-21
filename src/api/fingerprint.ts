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
