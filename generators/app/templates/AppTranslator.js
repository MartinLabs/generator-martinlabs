import Vue from 'vue';
import VueI18n from 'vue-i18n';

import LangEn from '../const/LangEn';
import LangPt from '../const/LangPt';

export default new (function() {
     
    Vue.use(VueI18n);
    Vue.config.lang = "en";

    Vue.locale("en", LangEn);
    Vue.locale("pt", LangPt);
    
    if (Vue.config.lang === "en") {
        this.data = LangEn;
    } else {
        this.data = LangPt;
    }
        
})();