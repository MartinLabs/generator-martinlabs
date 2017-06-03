import Vue from 'vue';
import VueI18n from 'vue-i18n';

import LangEn from '../const/LangEn';
import LangPt from '../const/LangPt';
     
Vue.use(VueI18n);

var at = {
    lang: "en"
};

at.i18n = new VueI18n({
    locale: at.lang,
    messages: {
        en: LangEn,
        pt: LangPt
    }
});
    
if (at.lang === "en") {
    at.data = LangEn;
} else {
    at.data = LangPt;
}

export default at;