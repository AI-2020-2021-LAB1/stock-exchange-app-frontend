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
          if (store.getters.user.role === 'USER') {
            next();
          } else {
            next('/403');
          }
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
          if (store.getters.user.role === 'ADMIN') {
            next();
          } else {
            next('/403');
          }
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
          if (store.getters.user.role === 'ADMIN') {
            next();
          } else {
            next('/403');
          }
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
          if (store.getters.user.role === 'ADMIN') {
            next();
          } else {
            next('/403');
          }
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
          if (store.getters.user.role === 'ADMIN') {
            next();
          } else {
            next('/403');
          }
        }
      },
    },
    {
      path: '/admin/benchmark',
      name: 'benchmark',
      component: () =>
        import(/* webpackChunkName: "index" */ '../views/Benchmark.vue'),
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next('/login');
        } else {
          if (store.getters.user.role === 'ADMIN') {
            next();
          } else {
            next('/403');
          }
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
    {
      path: '/403',
      name: 'error403',
      component: () =>
        import(/* webpackChunkName: "eror403" */ '../views/403.vue'),
    },
    {
      path: '/404',
      name: 'error404',
      component: () =>
        import(/* webpackChunkName: "error404" */ '../views/404.vue'),
    },
    { path: '*', redirect: '/404' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
