// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false;

window.localStorage.token = 'eL6mbI8p5ELkIqOu6eLaDUckaUDlulcSkzJUrjvcPBzHscugwCnC2XOnXyE89qXHztVmNt8YvhfFRJo5zIR4dg==';
window.localStorage.appKey = 'cpj2xarlc6yyn';

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
