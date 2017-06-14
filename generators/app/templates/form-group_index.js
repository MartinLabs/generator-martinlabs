import CheckboxGroup from './CheckboxGroup.vue';
import InputGroup from './InputGroup.vue';
import MultiselectGroup from './MultiselectGroup.vue';
import SelectGroup from './SelectGroup.vue';
import TextareaGroup from './TextareaGroup.vue';

export default {
    install(Vue) {
        Vue.component('CheckboxGroup', CheckboxGroup);
        Vue.component('InputGroup', InputGroup);
        Vue.component('MultiselectGroup', MultiselectGroup);
        Vue.component('SelectGroup', SelectGroup);
        Vue.component('TextareaGroup', TextareaGroup);
    }   
};
