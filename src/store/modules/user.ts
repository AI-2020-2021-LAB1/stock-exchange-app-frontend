import { Module } from 'vuex';
import axios from '../../axios';
import router from '../../router/router';

const userModule: Module<any, any> = {
  state: {
    token: null,
    refreshToken: null,
    user: { id: 0 },
    timeout: null,
  },

  mutations: {
    authUser(state, auth) {
      state.token = auth.token;
      state.refreshToken = auth.refreshToken;
    },
    storeUser(state, user) {
      state.user = user;
    },
    clearAuthData(state) {
      state.token = null;
      state.refreshToken = null;
      state.user = { id: 0 };
    },
    setTimeout(state, data) {
      state.timeout = data;
    },
  },

  actions: {
    // setRefreshTimer({ commit, dispatch }) {
    //     const to = setTimeout(() => {
    //         dispatch('refreshToken');
    //     }, 3300000);
    //     commit('setTimeout', to);
    // },
    login({ commit, dispatch }, authData) {
      // axios.post('login/', {
      //     username: authData.login,
      //     password: authData.password,
      // })
      //     .then((res) => {
      //         commit('authUser', {
      //             token: res.data.access,
      //             refreshToken: res.data.refresh,
      //         });
      //         dispatch('setRefreshTimer');
      //         dispatch('fetchUserData');
      //         router.replace('/');
      //     })
      //     .catch(() => {
      //         dispatch('setSnackbarState', {
      //             state: true,
      //             msg: 'Nieprawidłowy login lub hasło!',
      //             color: 'error',
      //             timeout: 7500,
      //         });
      //     });
      commit('authUser', {
        token: 'dummyToken',
        refreshToken: 'fakeRefreshToken',
      });
      dispatch('setSnackbarState', {
        state: true,
        msg: 'Zalogowano!',
        color: 'success',
        timeout: 5000,
      });
      router.replace('/');
    },
    logout({ dispatch, commit, state }) {
      commit('clearAuthData');
      if (router.currentRoute.name !== 'home') {
        router.replace('/');
      }
      dispatch('setSnackbarState', {
        state: true,
        msg: 'Wylogowano',
        color: 'info',
        timeout: 5000,
      });
      clearTimeout(state.timeout);
      commit('setTimeout', null);
    },
    // refreshToken({ dispatch, commit, state }) {
    //   axios
    //     .post('refresh-token/', {
    //       refresh: state.refreshToken,
    //     })
    //     .then((res) => {
    //       commit('authUser', {
    //         token: res.data.access,
    //         refreshToken: res.data.refresh,
    //       });
    //       dispatch('setRefreshTimer');
    //     });
    // },
  },

  getters: {
    user: (state) => state.user,
    token: (state) => state.token,
    isAuthenticated: (state) => state.token !== null,
  },
};

export default userModule;
