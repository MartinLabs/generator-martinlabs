import Vue from 'vue';

const bus = new Vue();

export default {
  install(v) {
    const methods = {
      emit(...args) { return bus.$emit(...args); },
      on(...args) { return bus.$on(...args); },

      success(message, duration) {
        this.emit('alert', message, 'success', duration);
      },

      warning(message, duration) {
        this.emit('alert', message, 'warning', duration);
      },

      error(message, duration) {
        this.emit('alert', message, 'error', duration);
      },
    };

    Object.assign(v.prototype, { $bus: methods });
    Object.assign(v, { $bus: methods });
  },
};
