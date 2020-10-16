import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navDrawer: false,
  },
  mutations: {
    setNavDrawerState(state, nav) {
      state.navDrawer = nav;
    },
  },
  actions: {
    setNavDrawerState({ commit }, nav) {
      commit('setNavDrawerState', nav);
    },
  },
  getters: {
    navDrawer: (state) => state.navDrawer,
  },
  modules: {
  },
});
