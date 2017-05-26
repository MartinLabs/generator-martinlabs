import Vue from 'vue';
import VueI18n from 'vue-i18n';

import LangEn from '../const/LangEn';
import LangPt from '../const/LangPt';
     
Vue.use(VueI18n);

var i18n = new VueI18n({
    locale: "pt",
    messages: {
        en: LangEn,
        pt: LangPt
    }
});
    
var at;
if (Vue.config.lang === "en") {
    at = { i18n, data: LangEn };
} else {
    at = { i18n, data: LangPt };
}

export default at;