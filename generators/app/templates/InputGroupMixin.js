import moment from 'moment';
import AppTranslator from '../../../service/AppTranslator';
import AppFilter from '../../../service/AppFilter';

export default {
    props: ["value", "required", "type", "maxlength", "label", "step", "placeholder"],
    data() {
        return  {};
    },
    computed: {
        mask() {
            if (this.type === "date") {
                return AppTranslator.data.dateFormat.datemask;
            } else if (this.type === "datetime") {
                return AppTranslator.data.dateFormat.datetimemask;
            } else if (this.type === "cpf") {
                return AppTranslator.data.format.cpf;
            } else if (this.type === "cnpj") {
                return AppTranslator.data.format.cnpj;
            } else if (this.type === "rg") {
                return AppTranslator.data.format.rg;
            } else if (this.type === "phone") {
                return AppTranslator.data.format.phone;
            } else if (this.type === "cep") {
                return AppTranslator.data.format.cep;
            } else {
                return null;
            }
        },
        computedModel: {
            get() {
                if (this.type === "date") {
                    return this.renderDate(this.value);
                } else if (this.type === "datetime") {
                    return this.renderDatetime(this.value);
                } else if (this.type === "cpf") {
                    return AppFilter.cpf(this.value);
                } else if (this.type === "cnpj") {
                    return AppFilter.cnpj(this.value);
                } else if (this.type === "rg") {
                    return AppFilter.rg(this.value);
                } else if (this.type === "phone") {
                    return AppFilter.phone(this.value);
                } else if (this.type === "cep") {
                    return AppFilter.cep(this.value);
                } else {
                    return this.value;
                }
            },
            set(val) {
                if (this.type === "date") {
                    this.populateDateValue(val);
                } else if (this.type === "datetime") {
                    this.populateDatetimeValue(val);
                } else if (["cpf", "cnpj", "rg", "phone", "cep"].indexOf(this.type) > -1) {
                    this.populateWithoutDelimiters(val);
                } else {
                    this.updateValue(val);
                }
            }
        }
    },
    methods: {
        updateValue(val) {
            this.$emit('input', val);
        },
        populateWithoutDelimiters(visual) {
            this.updateValue(AppFilter.removeDelimiters(visual));
        },
        renderDate(date) {
            if (date) {
                return moment(date).format(AppTranslator.data.dateFormat.date);
            } else {
                return null;
            }
        },
        populateDateValue(visual) {
            if (!visual || !visual.length) {
                this.updateValue(null);
                return;
            }
            
            var date = moment(visual, AppTranslator.data.dateFormat.date);
            
            if (date.isValid()) {
                this.updateValue(date.format());
            }
        },
        renderDatetime(date) {
            if (date) {
                return moment(date).format(AppTranslator.data.dateFormat.datetime);
            } else {
                return null;
            }
        },
        populateDatetimeValue(visual) {
            if (!visual || !visual.length) {
                this.updateValue(null);
                return;
            }
            
            var date = moment(visual, AppTranslator.data.dateFormat.datetime);
            
            if (date.isValid()) {
                this.updateValue(date.format());
            }
        }
    }
}