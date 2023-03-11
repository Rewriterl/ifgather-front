import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const INFOGATHER: AppRouteRecordRaw = {
  path: '/infogather',
  name: 'infogather',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.infogather',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: 'portscan',
      name: 'Portscan',
      component: () => import('@/views/infogather/portScan/index.vue'),
      meta: {
        locale: 'menu.infogather.portscan',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'subdomain',
      name: 'Subdomain',
      component: () => import('@/views/infogather/subdomainScan/index.vue'),
      meta: {
        locale: 'menu.infogather.subdomain',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'webfingerprint',
      name: 'Webfingerprint',
      component: () =>
        import('@/views/infogather/webFingerprintRecognition/index.vue'),
      meta: {
        locale: 'menu.infogather.webfingerprint',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default INFOGATHER;
