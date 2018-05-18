import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/homepage/Home';
import Info from '../components/Info';
import Session from '../components/homepage/Session';

Vue.use(Router);


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
    },
    {
      path: '/info',
      name: 'Session Information',
      component: Info,
    },
  ]
})
