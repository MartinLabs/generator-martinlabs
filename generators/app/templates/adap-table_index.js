import AdapStore from './Store';
import Orderby from './orderby.vue';
import Pagination from './pagination.vue';
import Searchfield from './searchfield.vue';

export default {
  install(Vue) {
    Vue.component('AdapOrderby', Orderby);
    Vue.component('AdapPagination', Pagination);
    Vue.component('AdapSearchfield', Searchfield);
    Object.assign(Vue.prototype, { $AdapStore: AdapStore });
  },
};
