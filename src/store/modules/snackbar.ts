import { Module } from 'vuex';

const snackbarModule: Module<any, any> = {
    state: {
        snackbarState: false,
        snackbarMsg: null,
        snackbarColor: null,
        snackbarTimeout: 7500,
    },

    mutations: {
        setSnackbarState(state, snack) {
            state.snackbarState = snack.state;
            state.snackbarMsg = snack.msg;
            state.snackbarColor = snack.color;
            state.snackbarTimeout = snack.timeout;
        },
    },

    actions: {
        setSnackbarState({ commit }, payload) {
            commit('setSnackbarState', payload);
        },
    },

    getters: {
        snackbarState: (state) => state.snackbarState,
        snackbarMsg: (state) => state.snackbarMsg,
        snackbarColor: (state) => state.snackbarColor,
        snackbarTimeout: (state) => state.snackbarTimeout,
    },
};

export default snackbarModule;
