import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '../firebase'
import router from '../router'

Vue.use(Vuex);

export const session = new Vuex.Store({
  state: {
    appTitle: 'Makeup Scheduler',
    user: null,
    code: '',
    error: null,
    loading: false
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setCode( state, payload){
      state.code = payload;
    }
  },
  actions: {
    userSignUp ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(firebaseUser => {
          commit('setUser', {email: firebaseUser.email})
          commit('setCode',payload.code);
          commit('setLoading', false)
          router.push('/session/'+ payload.code)
        })
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
    },
    userSignIn ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(firebaseUser => {
          commit('setUser', {email: firebaseUser.email})
          commit('setLoading', false);
          commit('setError', null);
          router.push('/session/' + payload.code)
        })
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {email: payload.email})
      commit('setCode',payload.code);
    },
    userSignOut ({commit}) {
      firebase.auth().signOut();
      commit('setUser', null);
      commit('setCode','');
      router.push('/')
    }
  },
  getters: {
    isAuthenticated (state) {
      return state.user !== null && state.user !== undefined
    }
  }
})
