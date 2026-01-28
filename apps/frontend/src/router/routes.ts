import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [],
  },
]
