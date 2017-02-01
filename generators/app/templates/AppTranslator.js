import Vue from 'vue';
import VueI18n from 'vue-i18n';

import LangEn from '../const/LangEn';
import LangPt from '../const/LangPt';
     
Vue.use(VueI18n);
Vue.config.lang = "en";

Vue.locale("en", LangEn);
Vue.locale("pt", LangPt);
    
var at;
if (Vue.config.lang === "en") {
    at = { data: LangEn };
} else {
    at = { data: LangPt };
}

export default at;