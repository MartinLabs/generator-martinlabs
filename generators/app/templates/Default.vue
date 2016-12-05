<template>
    <div class="wrapper">
        <div class="hold-transition skin-blue sidebar-mini" :class="{ 'sidebar-open': sidebarOpen }">
            <header class="main-header">
                <a href="#/home" class="logo">
                    <!-- mini logo for sidebar mini 50x50 pixels -->
                    <span class="logo-mini"><b></b></span>
                    <!-- logo for regular state and mobile devices -->
                    <span class="logo-lg"><b>{{ $t("app.title") }}</b></span>
                </a>
                <!-- Header Navbar: style can be found in header.less -->
                <nav class="navbar navbar-static-top">
                    <a class="sidebar-toggle" role="button" @click="sidebarOpen = !sidebarOpen">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <!-- Navbar Right Menu -->
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <!-- User Account: style can be found in dropdown.less -->
                            <li><a @click="logout"><i class="glyphicon glyphicon-lock"></i> <span>{{ $t("app.logout") }}</span></a></li>
                        </ul>
                    </div>
                </nav>
            </header>
            <aside class="main-sidebar">
                <!-- sidebar: style can be found in sidebar.less -->
                <section class="sidebar">
                    <!-- sidebar menu: : style can be found in sidebar.less -->
                    <ul class="sidebar-menu">
                        <li class="header">Menu</li>

                        <li><a href="#/home">{{ $t("home.title") }}</a></li><% 
                        for (var i in tables) { 
                        	var table = tables[i];
                        	if (table.inCrud && !table.isNtoNtable) {
					    %>
                        <li><a href="#/list<%= table.className %>">{{ $t("classes.<%= table.className %>.title") }}</a></li><%
                        	}
                    	} %>

                    </ul>
                </section>
                <!-- /.sidebar -->
            </aside>
            <!-- Main -->
            <div class="content-wrapper">
                <slot></slot>
            </div>

            <footer class="main-footer">
                <div class="pull-right hidden-xs">
                    <b>Versão</b> 0.0.1
                </div>
                {{ $t("app.title") }}
            </footer>
        </div>
    </div>
</template>

<script>

import simpleStorage from 'simpleStorage.js';

export default {
    name: "Default",
    data: function() {
        return  { sidebarOpen: false };
    },
    methods: {
        logout: function() {
            simpleStorage.deleteKey("token<%= modulenameUpper %>");
            this.$router.push("/login");
        }
    }
}

</script>