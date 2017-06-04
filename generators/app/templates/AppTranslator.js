import VueI18n from 'vue-i18n';
import LangEn from '../const/LangEn';
import LangPt from '../const/LangPt';
     
export default function buildTranslator(Vue) {
    Vue.use(VueI18n);

    var i18n = new VueI18n({
        locale: Vue.lang,
        messages: {
            en: LangEn,
            pt: LangPt
        }
    });

    if (Vue.lang === "en") {
        Vue.$lang = LangEn;
        Vue.prototype.$lang = LangEn;
    } else {
        Vue.$lang = LangPt;
        Vue.prototype.$lang = LangPt;
    }
    
    return i18n;
}