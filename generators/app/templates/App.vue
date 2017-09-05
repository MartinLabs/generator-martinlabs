<template>
    <div>
        <router-view></router-view>

        <div v-show="showAlert" class="alert horiz" :class="[alertType]">
            <span class="weight-1 text-center">{{ alertMessage }}</span>
            <a class="close" @click="showAlert = false"></a>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        showAlert: false,
        alertType: 'danger',
        alertMessage: '',
      };
    },
    mounted() {
      this.$bus.on('alert', (message, type, duration) => {
        this.alertType = type;
        this.alertMessage = message;
        this.showAlert = true;

        setTimeout(() => {
          this.showAlert = false;
        }, duration);
      });
    },
  };

</script>
<style lang="scss">
    @import '../scss/main.scss';
</style>