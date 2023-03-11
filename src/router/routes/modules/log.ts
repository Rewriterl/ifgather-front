import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LOG: AppRouteRecordRaw = {
  path: '/log',
  name: 'log',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.log',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: 'managerL',
      name: 'ManagerL',
      component: () => import('@/views/log/index.vue'),
      meta: {
        locale: 'menu.log.manager',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default LOG;
