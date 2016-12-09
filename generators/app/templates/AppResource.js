import Vue from 'vue';
import VueResource from 'vue-resource';
import AppRouter from './AppRouter';

Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
    //all requests pass by here
    next((resp) => {<% if (loginsys) { %> 
        if (resp.body.code === 33) {
            AppRouter.push("/login");
        }<% } %>
    });
});

export default new (function () {<% 
    if (loginsys) { %> 
    this.login = Vue.resource("../ws/<%= modulenameUpper %>/Login");<% 
    } 
    for (var i in tables) {
        var table = tables[i];
        if (table.inCrud && !table.isNtoNtable) {
    %>
    this.<%= table.classLowerCamel %> = Vue.resource("../ws/<%= modulenameUpper %>/<%= table.className %>{/id}");<%
        }
    }
    %>
})();