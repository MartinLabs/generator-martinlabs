<template>
    <div>
        <alert :show="showAlert" :type="alertType" :duration="alertDuration" 
            placement="top" width="400px" dismissable>
            <p>{{ alertMessage }}</p>
        </alert>
        <router-view></router-view>
    </div>
</template>

<script>
import alert from 'vue-strap/src/Alert.vue';
import AppBus from '../service/AppBus';

export default {
    name: "App",
    components: { alert },
    data() {
        return {
            showAlert: false,
            alertType: "danger",
            alertDuration: 3000,
            alertMessage: ""
        };
    },
    created() {
        AppBus.$on("alert", function (type, message, duration) {
            this.alertType = type;
            this.alertMessage = message;
            this.alertDuration = duration;
            this.showAlert = true;
            
            setTimeout(function(){ 
                this.showAlert = false;
            }.bind(this), duration);
        }.bind(this));
    }
}

</script>