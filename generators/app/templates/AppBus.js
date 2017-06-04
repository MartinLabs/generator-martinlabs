import Vue from 'vue';
var bus = new Vue();

export default {
    install(Vue) {
        var methods = {
            emit: function() { return bus.$emit.apply(bus, arguments); },
            on: function() { return bus.$on.apply(bus, arguments); },
            
            success(message, closeable, duration) {
                this.emit('alert', message, 'success', closeable, duration);
            },
            
            warning(message, closeable, duration) {
                this.emit('alert', message, 'warning', closeable, duration);
            },
            
            error(message, closeable, duration) {
                this.emit('alert', message, 'error', closeable, duration);
            }
        };
        
        Vue.prototype.$bus = methods;
        Vue.$bus = methods;
    }
}