import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MANAGER: AppRouteRecordRaw = {
  path: '/scan',
  name: 'scan',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.scan',
    icon: 'icon-storage',
    requiresAuth: true,
    order: 2,
  },
  children: [
    {
      path: 'manufacturer',
      name: 'ManagerC',
      component: () => import('@/views/scan/manager/index.vue'),
      meta: {
        locale: 'menu.scan.manager',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'subdomain',
      name: 'SubdomainM',
      component: () => import('@/views/scan/subdomain/index.vue'),
      meta: {
        locale: 'menu.scan.subdomain',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'ports',
      name: 'Ports',
      component: () => import('@/views/scan/ports/index.vue'),
      meta: {
        locale: 'menu.scan.ports',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'webinfo',
      name: 'Webinfo',
      component: () => import('@/views/scan/webinfo/index.vue'),
      meta: {
        locale: 'menu.scan.webinfo',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'engine',
      name: 'Engine',
      component: () => import('@/views/scan/engine/index.vue'),
      meta: {
        locale: 'menu.scan.engine',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'fingerprint',
      name: 'Fingerprint',
      component: () => import('@/views/scan/fingerprint/index.vue'),
      meta: {
        locale: 'menu.scan.fingerprint',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default MANAGER;
