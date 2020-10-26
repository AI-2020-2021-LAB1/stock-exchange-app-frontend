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
    setRefreshTimer({ commit, dispatch }) {
      const to = setTimeout(() => {
        dispatch('refreshToken');
      }, 3300000);
      commit('setTimeout', to);
    },
    login({ commit, dispatch }, authData) {
      const qs = require('qs');
      axios
        .post(
          'oauth/token',
          qs.stringify({
            username: authData.login,
            password: authData.password,
            scope: 'any',
            grant_type: 'password',
          }),
          {
            headers: {
              'Authorization': 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0',
              'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
          },
        )
        .then((res) => {
          commit('authUser', {
            token: res.data.access_token,
            refreshToken: res.data.refresh_token,
          });
          dispatch('setRefreshTimer');
          router.replace('/');
        })
        .catch(() => {
          dispatch('setSnackbarState', {
            state: true,
            msg: 'Nieprawidłowy login lub hasło!',
            color: 'error',
            timeout: 7500,
          });
        });
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
    refreshToken({ dispatch, commit, state }) {
      const qs = require('qs');
      axios
        .post(
          'oauth/token',
          qs.stringify({
            refresh_token: state.refreshToken,
            scope: 'any',
            grant_type: 'refresh_token',
          }),
          {
            headers: {
              'Authorization': 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0',
              'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
          },
        )
        .then((res) => {
          commit('authUser', {
            token: res.data.access_token,
            refreshToken: res.data.refresh_token,
          });
          dispatch('setRefreshTimer');
        });
    },
    register({ dispatch }, data) {
      axios
        .post('api/register/', data)
        .then((res) => {
          dispatch('setSnackbarState', {
            state: true,
            msg:
              'Rejestracja przebiegła pomyslnie. Teraz możesz się zalogować.',
            color: 'success',
            timeout: 7500,
          });
          router.replace('/login');
        })
        .catch((error) => {
          if (error.response.data.hasOwnProperty('username')) {
            dispatch('setSnackbarState', {
              state: true,
              msg: 'Użytkownik o takim loginie już istnieje!',
              color: 'error',
              timeout: 7500,
            });
          } else if (error.response.data.hasOwnProperty('email')) {
            dispatch('setSnackbarState', {
              state: true,
              msg: 'Użytkownik o takim adresie e-mail już istnieje!',
              color: 'error',
              timeout: 7500,
            });
          } else {
            dispatch('setSnackbarState', {
              state: true,
              msg:
                'Wystąpił nieznany błąd podczas rejestracji. Skontaktuj się z administratorem lub spróbuj ponownie później.',
              color: 'error',
              timeout: 7500,
            });
          }
        });
    },
  },

  getters: {
    user: (state) => state.user,
    token: (state) => state.token,
    isAuthenticated: (state) => state.token !== null,
  },
};

export default userModule;
