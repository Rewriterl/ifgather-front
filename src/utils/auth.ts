import { logout } from '@/api/user';

const TOKEN_KEY = 'ifgather';

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
};

const isLogin = () => {
  return !!getCookie(TOKEN_KEY);
};
const deleteCookie = (name: string, path?: string, domain?: string): void => {
  document.cookie = `${name}=; path=${path ?? '/'}; domain=${
    domain ?? ''
  }; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
};

const getToken = () => {
  // return localStorage.getItem(TOKEN_KEY);
  return getCookie(TOKEN_KEY);
};

// const setToken = (token: string) => {
//   localStorage.setItem(TOKEN_KEY, token);
// };

const clearToken = () => {
  // localStorage.removeItem(TOKEN_KEY);
  deleteCookie(TOKEN_KEY);
};

export { isLogin, getToken, clearToken };
