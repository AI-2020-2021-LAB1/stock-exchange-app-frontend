import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import store from './store';

const PasswordValidator = () => import(/* webpackChunkName: "ComponentPasswordValidator" */ '@/components/PasswordValidator.vue');

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');

Vue.component('password-validator', PasswordValidator);
