import { Module } from 'vuex';
import axios from '../../axios';
import router from '../../router/router';

const userModule: Module<any, any> = {
  state: {
    token: null,
    refreshToken: null,
    timeout: null,
    user: { id: 0, role: undefined },
  },

  mutations: {
    authUser(state, auth) {
      state.token = auth.token;
      state.refreshToken = auth.refreshToken;
    },
    clearAuthData(state) {
      state.token = null;
      state.refreshToken = null;
      state.user = { id: 0, role: undefined };
    },
    setTimeout(state, data) {
      state.timeout = data;
    },
    setUser(state, data) {
      state.user = data;
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
          dispatch('setSnackbarState', {
            state: true,
            msg: 'Zalogowano',
            color: 'success',
            timeout: 7500,
          });
          router.replace('/');
          dispatch('getUserData');
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
    getUserData({ dispatch, commit, state }) {
      axios
        .get('api/user/config/user-data', {
          headers: {
            Authorization: 'Bearer ' + state.token,
          },
        })
        .then((res) => {
          commit('setUser', res.data);
        })
        .catch((err) => {
          dispatch('setSnackbarState', {
            state: true,
            msg:
              'Błąd ' +
              err.response.status +
              ' przy pobieraniu danych użytkownika!',
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
    changeName({ dispatch, state }, data) {
      axios
        .put(
          '/api/user/config/user-data',
          {
            firstName: data.firstName,
            lastName: data.lastName,
          },
          {
            headers: {
              Authorization: 'Bearer ' + state.token,
            },
          },
        )
        .then(() => {
          dispatch('getUserData');
          dispatch('setSnackbarState', {
            state: true,
            msg: 'Dane zostały zmienione!',
            color: 'success',
            timeout: 7500,
          });
        })
        .catch((err) => {
          dispatch('setSnackbarState', {
            state: true,
            msg: 'Błąd ' + err.response.status + ' przy zmianie danych!',
            color: 'error',
            timeout: 7500,
          });
        });
    },
    changePassword({ dispatch, state }, data) {
      axios
        .post('/api/user/config/change-password', data, {
          headers: {
            Authorization: 'Bearer ' + state.token,
          },
        })
        .then(() => {
          dispatch('logout');
        })
        .catch((err) => {
          dispatch('setSnackbarState', {
            state: true,
            msg: 'Błąd ' + err.response.status + ' przy zmianie hasła!',
            color: 'error',
            timeout: 7500,
          });
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
          let info;
          if (error.response.status === 409) {
            info =
              'Rejestracja nie powiodła się. Istenieje już użytkownik o podanym mailu.';
          } else {
            info =
              'Wystąpił nieznany błąd podczas rejestracji. Skontaktuj się z administratorem lub spróbuj ponownie później.';
          }
          dispatch('setSnackbarState', {
            state: true,
            msg: info,
            color: 'error',
            timeout: 7500,
          });
        });
    },
  },

  getters: {
    token: (state) => state.token,
    isAuthenticated: (state) => state.token !== null,
    user: (state) => state.user,
  },
};

export default userModule;
