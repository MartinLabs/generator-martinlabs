<template>
    <div class="horiz mob-verti w-window h-window">
        <aside class="menu des-w-200 tab-w-200 w-full verti">
            <div class="horiz items-center">
                <a class="mobile icon icon-menu" @click="showMenu = !showMenu"></a>
                <h1 class="weight-1 text-center accent">
                    {{ $t("app.title") }}
                </h1>
            </div>
            <ul class="p-0 py-10 weight-1" :class="{ 'desktop-tablet': !showMenu }">

                <li><router-link to="/home" @click.native="showMenu = false">
                    {{ $t("home.title") }}
                </router-link></li><% 
                for (var i in tables) { 
                	var table = tables[i];
                	if (table.inCrud && !table.isNtoNtable) {
			    %>
                <li><router-link to="/list<%= table.className %>" exact @click.native="showMenu = false">
                    {{ $t("classes.<%= table.className %>.title") }}
                </router-link></li><%
                	}
            	} %>
                <li><a @click="logout">{{ $t("app.logout") }}</a></li>
            </ul>
            <footer class="p-10 desktop-tablet">
                <small><b>{{ $t("app.version") }}</b> {{ version }}</small>
            </footer>
        </aside>

        <router-view class="weight-1 px-20 py-10"></router-view>
    </div>
</template>

<script>
  import simpleStorage from 'simplestorage.js';
  import { version } from '../../../../package.json';

  export default {
    data() {
      return {
        showMenu: false,
        version,
      };
    },
    methods: {
      logout() {
        simpleStorage.deleteKey('token<%= modulenameUpper %>');
        this.$router.push('/login');
      },
    },
  };

</script>