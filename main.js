import Vue from 'vue'
import App from './App'
import store from './store'
import {http,httpAll} from './utils/request.js'
Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$http = http;
Vue.prototype.$httpAll = httpAll;
const app = new Vue({
	store,
    ...App
})
app.$mount()
