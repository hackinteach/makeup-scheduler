import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/homepage/Home';
import Info from '../components/Info';
import Session from '../components/homepage/Session';
import {auth} from '../firebase';
Vue.use(Router);
const AuthGuard = (to, from, next) => {
  if (firebase.auth().currentUser) {
    next()
  } else {
    next('/')
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/session/:id',
      name: 'Session',
      component: Session,
      beforeEnter: AuthGuard,
    },
    {
      path: '/info',
      name: 'Session Information',
      component: Info,
      beforeEnter: AuthGuard,
    },
  ]
})
