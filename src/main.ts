import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import store from './store';
import VueApexCharts from 'vue-apexcharts';

const PasswordValidator = () => import(/* webpackChunkName: "ComponentPasswordValidator" */ '@/components/PasswordValidator.vue');
const ChartView = () => import(/* webpackChunkName: "ComponentChartView" */ '@/components/ChartView.vue');
const DetailedList = () => import(/* webpackChunkName: "ComponentDetailedList" */ '@/components/DetailedList.vue');
const ElementSelector = () => import(/* webpackChunkName: "ComponentElementSelector" */ '@/components/ElementSelector.vue');

Vue.config.productionTip = false;

Vue.use(VueApexCharts);

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');

Vue.component('apexchart', VueApexCharts);
Vue.component('password-validator', PasswordValidator);
Vue.component('chart-view', ChartView);
Vue.component('detailed-list', DetailedList);
Vue.component('element-selector', ElementSelector);
