import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/homepage/Home'
import Personal from '../components/homepage/Personal'
import Info from '../components/Info';
import {auth, db} from '../firebase'
import InfoDialog from '../components/session/InfoDialog';

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
  const dbRef = db.ref('session/' + sid);
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
      path: '/session/:id',
      name: 'Session',
      component: Personal,
      beforeEnter: AuthGuard
    },
    {
      path: '/info',
      name: 'Session Information',
      component: Info,
    },
    {
      path: '/dialog/:id',
      name: 'Session Information 2',
      component: InfoDialog,
    }
  ]
})
