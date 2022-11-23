import Vue from 'vue'
import App from './App.vue'
import store from './store'
import func  from './func.js'
import VueToastify from "vue-toastify";

const {ipcRenderer}   = require('electron');
const FindInPage      = require('electron-find').FindInPage;


/**
 * EVENT DESCRIPTION : main listener for DOMContentLoaded event
 */
document.addEventListener('DOMContentLoaded', (event) => {
  let findInPage = new FindInPage(require('electron').remote.getCurrentWebContents());

  ipcRenderer.on('on-find', (e, args) => {
      findInPage.openFindWindow()
    });
});

Vue.config.productionTip = false
Vue.prototype.$func = func;

Vue.use(VueToastify,{
  position:"top-right"
});

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
