import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/scan'
  },
  {
    path: '/tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/scan'
      },
      {
        path: 'scan',
        name: 'scan',
        component: () => import('@/views/ScanView.vue')
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/HistoryView.vue')
      },
      {
        path: 'collection',
        name: 'collection',
        component: () => import('@/views/CollectionView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
