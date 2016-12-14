<template>

    <div class="container">
        <form @submit="login">
            <h2>{{ $t("login.subtitle") }}</h2>
            <input v-model="account" type="text" class="form-control" :placeholder="$t('login.account')" required autofocus/>
            <input v-model="password" type="password" class="form-control" :placeholder="$t('login.password')" required>
            <button class="btn btn-lg btn-primary btn-block" type="submit">{{ $t("login.signin") }}</button>
        </form>

    </div>

</template>

<script>
import sha1 from 'js-sha1';
import simpleStorage from 'simpleStorage.js';
import AppResource from '../service/AppResource';
import AppBus from '../service/AppBus';

export default {
    name: "Login", 
    methods: {
        login(e) {
            e.preventDefault();

            AppResource.login.save({
                account: this.account,
                password: sha1(this.password)
            }).then((resp) => {
                if (resp.body.success) {
                    simpleStorage.set("token<%= modulenameUpper %>", resp.body.data);
                    this.$router.push("/home");
                } else {
                    AppBus.$emit("alert", "danger", resp.body.message, 3000);
                }
            });
        }
    }
}
</script>

<style lang="sass" scoped>

.container {  
    margin-top: 80px;
    margin-bottom: 80px;
}

form {
  max-width: 380px;
  padding: 15px 35px 45px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,0.1);  

    .form-control {
        position: relative;
        font-size: 16px;
        height: auto;
        padding: 10px;
        box-sizing: border-box;

        &:focus {
          z-index: 2;
        }
    }

    input[type="text"] {
      margin-bottom: -1px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    input[type="password"] {
      margin-bottom: 20px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
}

</style>