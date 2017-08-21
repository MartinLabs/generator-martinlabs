<template>

    <div class="verti w-window h-window items-center">
        <form @submit="login" class="verti w-300 elevated p-30">
            <h2 class="mt-0">{{ $t("login.subtitle") }}</h2>
            <input v-model="account" class="mb-10" type="text" :placeholder="$t('login.account')" required autofocus/>
            <input v-model="password" class="mb-10" type="password" :placeholder="$t('login.password')" required>
            <button class="accent" type="submit">{{ $t("login.signin") }}</button>
        </form>
    </div>

</template>

<script>
import sha256 from 'js-sha256';
import simpleStorage from 'simpleStorage.js';

export default {
    name: "Login", 
    data() {
        return {
            account: null,
            password: null
        };
    },
    mounted() {
        if (simpleStorage.get("token<%= modulenameUpper %>")) {
            this.$router.push("/home");
        }
    },
    methods: {
        login(e) {
            e.preventDefault();

            this.$resources.login.save({
                account: this.account,
                password: sha256(this.password)
            }).then(resp => {
                simpleStorage.set("token<%= modulenameUpper %>", resp.body.token);
                simpleStorage.set("id<%= modulenameUpper %>", resp.body.id);
                                    
                var beforeLoginIntention = simpleStorage.get("beforeLoginIntention") || null;
                if (beforeLoginIntention) {
                    simpleStorage.deleteKey("beforeLoginIntention");
                    location.href = beforeLoginIntention;
                } else {
                    this.$router.push("/home");
                }
            });
        }
    }
}
</script>