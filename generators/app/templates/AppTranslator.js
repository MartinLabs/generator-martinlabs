import VueI18n from 'vue-i18n';
import LangEn from '../locale/LangEn';
import LangPt from '../locale/LangPt';

export default function buildTranslator(Vue) {
  Vue.use(VueI18n);

  const i18n = new VueI18n({
    locale: Vue.lang,
    messages: {
      en: LangEn,
      pt: LangPt,
    },
  });

  if (Vue.lang === 'en') {
    Object.assign(Vue.prototype, { $lang: LangEn });
    Object.assign(Vue, { $lang: LangEn });
  } else {
    Object.assign(Vue.prototype, { $lang: LangPt });
    Object.assign(Vue, { $lang: LangPt });
  }

  return i18n;
}
