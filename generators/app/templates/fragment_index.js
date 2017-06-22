import Default from './Default.vue';
import AdapTable from './adap-table';
import FormGroup from './form-group';
import LineChart from './LineChart.vue';
import LoadBox from './LoadBox.vue';
import Modal from './Modal.vue';

export default {
    install(Vue) {
        Vue.component("Default", Default);
        Vue.component("LineChart", LineChart);
        Vue.component("LoadBox", LoadBox);
        Vue.component("Modal" , Modal);
        Vue.use(AdapTable);
        Vue.use(FormGroup);
    }   
};
