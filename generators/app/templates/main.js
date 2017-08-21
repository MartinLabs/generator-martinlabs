import Vue from 'vue';
import App from './controller/App.vue';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

//plugins
import VueMask from 'v-mask';
import VueMoment from 'vue-moment';
import AppBus from './service/AppBus';
import AppFilter from './service/AppFilter';
import AppResource from './service/AppResource';
import AppFragments from './controller/fragment';


//builders
import AppTranslator from './service/AppTranslator';
import AppRouter from './service/AppRouter';

Vue.lang = "en";

Vue.use(VueMask);
Vue.use(VueMoment);
Vue.use(AppBus);
Vue.use(AppFilter);
Vue.use(AppResource);
Vue.use(AppFragments);

OfflinePluginRuntime.install()

new Vue({
    el: '#app',
    i18n: AppTranslator(Vue),
    router: AppRouter(Vue),
    render: h => h(App)
});