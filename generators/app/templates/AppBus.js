import Vue from 'vue';

const bus = new Vue();

export default {
  install(v) {
    const methods = {
      emit(...args) { return bus.$emit(...args); },
      on(...args) { return bus.$on(...args); },

      success(message, closeable, duration) {
        this.emit('alert', message, 'success', closeable, duration);
      },

      warning(message, closeable, duration) {
        this.emit('alert', message, 'warning', closeable, duration);
      },

      error(message, closeable, duration) {
        this.emit('alert', message, 'error', closeable, duration);
      },
    };

    Object.assign(v.prototype, { $bus: methods });
    Object.assign(v, { $bus: methods });
  },
};
