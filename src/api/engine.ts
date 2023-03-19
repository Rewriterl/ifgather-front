import axios from 'axios';

export interface NsqConfig {
  nsqd_host: string;
  nsqd_http: string;
  time: number;
}

export interface PortscanConfig {
  verify: boolean;
  ping: boolean;
  retries: number;
  rate: number;
  timeout: number;
  ports: string;
  nmap_timeout: number;
  waf_num: number;
  detection: 'top100' | 'top1000' | 'null';
  nsq_timeout: number;
}

export interface DomainConfig {
  timeout: number;
  max_enum_time: number;
  nsq_timeout: number;
}

export interface ApikeyConfig {
  shodan: string;
  binaryedge: string;
  censys_token: string;
  censys_secret: string;
  certspotter: string;
  github: string;
  spyse: string;
  securitytrails: string;
  threatbook: string;
  urlscan: string;
  virustotal: string;
}

export interface WebinfoConfig {
  wappalyzertimeout: number;
  spidertimeout: number;
  maxdepth: number;
  concurrent: number;
}

export interface ClientConfig {
  nsq: NsqConfig;
  portscan: PortscanConfig;
  domain: DomainConfig;
  apikey: ApikeyConfig;
  webinfo: WebinfoConfig;
  banalyze: null;
}
interface APIKeyEngineNsqReq {
  NsqHost: string;
  NsqHttp: string;
  Time: number;
}

export interface ApiKeyEnginePortScanReq {
  verify: boolean;
  ping: boolean;
  retries: number;
  rate: number;
  timeout: number;
  ports: string;
  nmap_timeout: number;
  waf_num: number;
  detection: 'top100' | 'top1000' | 'null';
  nsq_timeout: number;
}

export interface ApiKeyEngineDomainReq {
  timeout: number;
  maxEnumTime: number;
  nsqTimeout: number;
}

export interface ApiKeyEngineKeyReq {
  shodan: string;
  binaryedge?: string;
  censys_token?: string;
  censys_secret?: string;
  certspotter?: string;
  github?: string;
  spyse?: string;
  securitytrails?: string;
  threatbook?: string;
  urlscan?: string;
  virustotal?: string;
}

interface ApiKeyEngineWebInfoReq {
  wappalyzerTimeout: number;
  spiderTimeout: number;
  maxDepth: number;
  concurrent: number;
}

export function getClientConfig(pwd: string) {
  return axios.get(`/scan/client/info?pwd=${pwd}`);
}

export function setNsq(params: NsqConfig) {
  const reqParams: APIKeyEngineNsqReq = {
    NsqHost: params.nsqd_host,
    NsqHttp: params.nsqd_http,
    Time: params.time,
  };
  return axios.post(`/scan/engine/nsq`, reqParams);
}

export function setPortScan(params: PortscanConfig) {
  const reqParams: ApiKeyEnginePortScanReq = {
    verify: params.verify,
    ping: params.ping,
    retries: params.retries,
    rate: params.rate,
    timeout: params.timeout,
    ports: params.ports,
    nmap_timeout: params.nmap_timeout,
    waf_num: params.waf_num,
    detection: params.detection,
    nsq_timeout: params.nsq_timeout,
  };
  return axios.post(`/scan/engine/portscan`, reqParams);
}

export function setDomain(params: DomainConfig) {
  const reqParams: ApiKeyEngineDomainReq = {
    timeout: params.timeout,
    maxEnumTime: params.max_enum_time,
    nsqTimeout: params.nsq_timeout,
  };
  return axios.post(`/scan/engine/domain`, reqParams);
}

export function setApikey(params: ApikeyConfig) {
  const reqParams: ApiKeyEngineKeyReq = {
    shodan: params.shodan,
    binaryedge: params.binaryedge,
    censys_token: params.censys_token,
    censys_secret: params.censys_secret,
    certspotter: params.certspotter,
    github: params.github,
    spyse: params.spyse,
    securitytrails: params.securitytrails,
    threatbook: params.threatbook,
    urlscan: params.urlscan,
    virustotal: params.virustotal,
  };
  return axios.post(`/scan/engine/apikey`, reqParams);
}

export function setWebinfo(params: WebinfoConfig) {
  const reqParams: ApiKeyEngineWebInfoReq = {
    wappalyzerTimeout: params.wappalyzertimeout,
    spiderTimeout: params.spidertimeout,
    maxDepth: params.maxdepth,
    concurrent: params.concurrent,
  };
  return axios.post(`/scan/engine/webinfo`, reqParams);
}
