import moment from 'moment';

export default {
  props: ['value', 'required', 'type', 'maxlength', 'label', 'step', 'placeholder'],
  data() {
    return {};
  },
  computed: {
    mask() {
      if (this.type === 'date') {
        return this.$lang.dateFormat.datemask;
      } else if (this.type === 'datetime') {
        return this.$lang.dateFormat.datetimemask;
      } else if (this.type === 'cpf') {
        return this.$lang.format.cpf;
      } else if (this.type === 'cnpj') {
        return this.$lang.format.cnpj;
      } else if (this.type === 'rg') {
        return this.$lang.format.rg;
      } else if (this.type === 'phone') {
        return this.$lang.format.phone;
      } else if (this.type === 'cep') {
        return this.$lang.format.cep;
      }
      return null;
    },
    computedModel: {
      get() {
        if (this.type === 'date') {
          return this.renderDate(this.value);
        } else if (this.type === 'datetime') {
          return this.renderDatetime(this.value);
        } else if (this.type === 'cpf') {
          return this.$filters.cpf(this.value);
        } else if (this.type === 'cnpj') {
          return this.$filters.cnpj(this.value);
        } else if (this.type === 'rg') {
          return this.$filters.rg(this.value);
        } else if (this.type === 'phone') {
          return this.$filters.phone(this.value);
        } else if (this.type === 'cep') {
          return this.$filters.cep(this.value);
        }
        return this.value;
      },
      set(val) {
        if (this.type === 'date') {
          this.populateDateValue(val);
        } else if (this.type === 'datetime') {
          this.populateDatetimeValue(val);
        } else if (['cpf', 'cnpj', 'rg', 'phone', 'cep'].indexOf(this.type) > -1) {
          this.populateWithoutDelimiters(val);
        } else {
          this.updateValue(val);
        }
      },
    },
  },
  methods: {
    updateValue(val) {
      this.$emit('input', val);
    },
    populateWithoutDelimiters(visual) {
      this.updateValue(this.$filters.removeDelimiters(visual));
    },
    renderDate(date) {
      if (date) {
        return moment(date).format(this.$lang.dateFormat.date);
      }
      return null;
    },
    populateDateValue(visual) {
      if (!visual || !visual.length) {
        this.updateValue(null);
        return;
      }

      const date = moment(visual, this.$lang.dateFormat.date);

      if (date.isValid()) {
        this.updateValue(date.format());
      }
    },
    renderDatetime(date) {
      if (date) {
        return moment(date).format(this.$lang.dateFormat.datetime);
      }
      return null;
    },
    populateDatetimeValue(visual) {
      if (!visual || !visual.length) {
        this.updateValue(null);
        return;
      }

      const date = moment(visual, this.$lang.dateFormat.datetime);

      if (date.isValid()) {
        this.updateValue(date.format());
      }
    },
  },
};
