import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { Params } from '@/api/manager';

export interface LoginData {
  Username: string;
  Password: string;
}

export interface UserParam {
  username: string;
  password: string;
  email: string;
  remark: string;
  nickname: string;
  phone: string;
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

export function getUserList(params: Params) {
  return axios.get<UserState[]>('users', {
    params,
  });
}

export function delUserByid(id: string) {
  return axios.delete(`user`, {
    data: `{"id":"${id}"}`,
  });
}

export function addUser(data: UserParam) {
  return axios.post<UserState>('user', data);
}
