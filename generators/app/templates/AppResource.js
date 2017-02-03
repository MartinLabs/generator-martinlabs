import Vue from 'vue';
import VueResource from 'vue-resource';
import AppRouter from './AppRouter';
import simpleStorage from 'simpleStorage.js';

Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
    //all requests pass by here
    var token = simpleStorage.get("token<%= modulenameUpper %>") || null;
    if (token) {
        request.headers.set('Authorization', 'Bearer ' + token);
    }

    next((resp) => {
        if (resp.body.code === 33) {
            simpleStorage.deleteKey("token<%= modulenameUpper %>");
            simpleStorage.set("beforeLoginIntention", location.href);
            AppRouter.push("/login");
        }
    });
});

export default new (function () {
    this.login = Vue.resource("../ws/<%= modulenameUpper %>/Login");<% 
    
    for (var i in tables) {
        var table = tables[i];
        if (table.inCrud && !table.isNtoNtable) {
    %>
    this.<%= table.classLowerCamel %> = Vue.resource("../ws/<%= modulenameUpper %>/<%= table.className %><% 
if (table.primaryColumns.length == 1) {
    %>{/id}<%
} else {
    for (var k in table.primaryColumns) {
        %>{/<%= table.primaryColumns[k].propertyName %>}<%
    } 
}
        %>");<%
        }
    }
    %>
})();