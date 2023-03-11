import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  Username: string;
  Password: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('login', data);
}

export function logout() {
  return axios.post<LoginRes>('/user/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/user');
}

export function patchUserInfo(data: Partial<UserState>) {
  return axios.patch<UserState>('/user', data);
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('user/menu');
}
