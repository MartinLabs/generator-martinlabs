var Vue = require("vue");
var VueRouter = require('vue-router');

var Home = require('../controller/Home.vue.js');

Vue.use(VueRouter);

module.exports = new VueRouter({
    routes: [
        { path: '/home', component: Home },
        { path: '*', redirect: '/home' }
    ]
});