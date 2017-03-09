var VueMask = require('v-mask');
var VueMoment = require('vue-moment');
var VueRouter = require('vue-router');
var App = require('./controller/App.vue.js');
var AppRouter = require('./service/AppRouter');

var Home = require('./controller/Home.vue.js');

Vue.use(VueMask);
Vue.use(VueMoment);
Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        { path: '/home', component: Home },
        { path: '*', redirect: '/home' }
    ]
});

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});