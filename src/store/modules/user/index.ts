import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  patchUserInfo,
} from '@/api/user';
import { clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    username: undefined,
    avatar: undefined,
    email: undefined,
    nick_name: undefined,
    phone: undefined,
    create_at: undefined,
    remark: undefined,
    id: undefined,
    certification: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
      this.role = partial.username === 'admin' ? 'admin' : '';
      this.avatar =
        'https://gcore.jsdelivr.net/gh/Rewriterl/cdn@0.1/avater.png';
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();

      this.setInfo(res.data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        await userLogin(loginForm);
        await this.info();
        // setToken(res.data.token);
      } catch (err) {
        console.log(err);
        // clearToken();
        throw err;
      }
    },
    async patchUserInfo(data: Partial<UserState>) {
      await patchUserInfo(data);
      await this.info();
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
