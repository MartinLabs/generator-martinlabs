var VueMask = require('v-mask');
var VueMoment = require('vue-moment');
var App = require('./controller/App.vue.js');

Vue.use(VueMask);
Vue.use(VueMoment);

new Vue({
    el: '#app',
    render: h => h(App)
});