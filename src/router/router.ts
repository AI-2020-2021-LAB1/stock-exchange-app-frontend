import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () =>
        import(/* webpackChunkName: "index" */ '../views/Index.vue'),
    },
    {
      path: '/benchmark',
      name: 'benchmark',
      component: () =>
        import(/* webpackChunkName: "index" */ '../views/Benchmark.vue'),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () =>
        import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    },
    {
      path: '/trader',
      name: 'trader',
      component: () =>
        import(/* webpackChunkName: "Trader" */ '../views/Trader.vue'),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
