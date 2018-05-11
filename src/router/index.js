import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/homepage/Home'
import Session from '../components/homepage/Session'
import Info from '../components/Info';
import {auth, db} from '../firebase'

Vue.use(Router);

const AuthGuard = (to, from, next) => {
  // if (firebase.auth().currentUser) {
  //   next()
  // } else {
  //   next('/')
  // }
  next();
};

const SessionCheck = (to, from, next) => {
  const sid = this.$route.params.id;
  const sname = this.$route.params.name;
  const dbRef = db.ref('session/' + sname);
  const dbId = dbRef.once('value').then(session => {
    return session.id
  });
  if (sid === dbId) {
    next()
  } else {
    next('/')
  }
};

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/session',
      name: 'Session',
      component: Session,
      beforeEnter: AuthGuard
    },
    {
      path: '/info',
      name: 'Session Information',
      component: Info,
    }
  ]
})
