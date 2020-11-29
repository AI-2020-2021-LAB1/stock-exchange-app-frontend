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
      path: '/user',
      name: 'user',
      component: () =>
        import(/* webpackChunkName: "User" */ '../views/User.vue'),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () =>
        import(/* webpackChunkName: "Admin" */ '../views/Admin.vue'),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      },
    },
    {
      path: '/admin/stocks',
      name: 'admin-stocks',
      component: () =>
        import(/* webpackChunkName: "AdminStocks" */ '../views/AdminManageStocks.vue'),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      },
    },
    {
      path: '/admin/tags',
      name: 'admin-tags',
      component: () =>
        import(/* webpackChunkName: "AdminTags" */ '../views/AdminManageTags.vue'),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () =>
        import(/* webpackChunkName: "AdminUsers" */ '../views/AdminManageUsers.vue'),
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
