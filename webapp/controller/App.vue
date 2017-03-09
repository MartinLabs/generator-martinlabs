<template>
    <div>
        <div 
            v-show="showAlert" 
            transition="fade" 
            role="alert" 
            :class="['alert', bsAlertType]">

            <button type="button" class="close" @click="showAlert = false">
                <span>×</span>
            </button> 
            <p>{{ alertMessage }}</p>

        </div>

        <router-view></router-view>
    </div>
</template>

<script>

    export default {
        name: "App",
        data() {
            return {
                showAlert: false,
                alertType: "danger",
                alertMessage: ""
            };
        },
        computed: {
            bsAlertType() {
                return "alert-" + this.alertType;
            }
        },
        created() {
            // AppBus.$on("alert", (type, message, duration) => {
            //     this.alertType = type;
            //     this.alertMessage = message;
            //     this.showAlert = true;

            //     setTimeout(() => {
            //         this.showAlert = false;
            //     }, duration);
            // });
        }
    }

</script>
<style lang="sass" scoped>

    .alert{
        width: 400px;
        position: fixed;
        top: 30px;
        margin: 0 auto;
        left: 0;
        right: 0;
        z-index: 1050;
    }

</style>