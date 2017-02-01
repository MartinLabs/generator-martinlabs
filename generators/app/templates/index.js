import Vue from 'vue';
import VueMask from 'v-mask';
import VueMoment from 'vue-moment';
import App from './controller/App.vue';
import AppRouter from './service/AppRouter';
import AppTranslator from './service/AppTranslator';
import AppResource from './service/AppResource';
import AppFilter from './service/AppFilter';

Vue.use(VueMask);
Vue.use(VueMoment);

new Vue({
    el: '#app',
    router: AppRouter,
    render: h => h(App)
});