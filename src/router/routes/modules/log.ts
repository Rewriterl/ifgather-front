import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LOG: AppRouteRecordRaw = {
  path: '/log',
  name: 'log',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.log',
    icon: 'icon-book',
    requiresAuth: true,
    order: 3,
  },
  children: [
    {
      path: 'login',
      name: 'LoginLog',
      component: () => import('@/views/log/login/index.vue'),
      meta: {
        locale: 'menu.log.login',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'operation',
      name: 'Operation',
      component: () => import('@/views/log/operation/index.vue'),
      meta: {
        locale: 'menu.log.operation',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default LOG;
