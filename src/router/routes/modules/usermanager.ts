import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USERMANAGER: AppRouteRecordRaw = {
  path: '/usermanager',
  name: 'usermanager',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.usermanager',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: 'managerU',
      name: 'ManagerU',
      component: () => import('@/views/usermanager/index.vue'),
      meta: {
        locale: 'menu.usermanager',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default USERMANAGER;
