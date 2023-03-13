import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import axios from 'axios';

export interface PolicyRecord {
  id: string;
  name: string;
  cus_name: string;
  cus_subdomain_num: number;
  cus_web_num: number;
  cus_port_num: number;
  cus_vul_num: number;
  cus_time: string;
}

export interface Params extends Partial<PolicyRecord> {
  page: number;
  limit: number;
  searchParams?: string;
}

export interface AddParams {
  cusName: string;
  cusRemark: string;
}

export interface PolicyListRes {
  data: PolicyRecord[];
  count: number;
  code: number;
  msg: string;
}

export function queryManufcList(params: Params) {
  params.searchParams = `{ "CusName": "${params.searchParams}" }`;
  return axios.get('/scan/manager', {
    params,
  });
}

export function queryManufcDomainList(params: Params) {
  return axios.get('/scan/domain', {
    params,
  });
}

export function deleteManufc(cusName: string) {
  return axios.delete('/scan/manager', {
    data: `{ "CusName": "${cusName}" }`,
  });
}

export function addManufc(params: AddParams) {
  return axios.post('/scan/manager', params);
}

export interface ServiceRecord {
  id: number;
  title: string;
  description: string;
  name?: string;
  actionType?: string;
  icon?: string;
  data?: DescData[];
  enable?: boolean;
  expires?: boolean;
}

export function queryInspectionList() {
  return axios.get('/api/list/quality-inspection');
}

export function queryTheServiceList() {
  return axios.get('/api/list/the-service');
}

export function queryRulesPresetList() {
  return axios.get('/api/list/rules-preset');
}

export interface domainParams {
  CusName: string;
  Domain: string;
}

export function addDomain(params: domainParams) {
  return axios.post('/scan/domain', params);
}
