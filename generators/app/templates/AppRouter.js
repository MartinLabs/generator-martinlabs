import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../controller/Home.vue';
import Login from '../controller/Login.vue';<%

for (var i in tables) { 
    var table = tables[i];
    if (table.inCrud && !table.isNtoNtable) {
%>
import List<%= table.className %> from '../controller/List<%= table.className %>.vue';<% 
    } 
} 

for (var i in tables) { 
    var table = tables[i];
    if (table.inCrud && !table.isNtoNtable) {
%>
import Persist<%= table.className %> from '../controller/Persist<%= table.className %>.vue';<% } } %>

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        { path: '/home', component: Home },
        { path: '/login', component: Login },<% 
for (var i in tables) { 
    var table = tables[i];
    if (table.inCrud && !table.isNtoNtable) {
%>
        { path: '/list<%= table.className %>', component: List<%= table.className %> },<% 
    } 
} 

for (var i in tables) { 
    var table = tables[i];
    if (table.inCrud && !table.isNtoNtable) {
%>
        { path: '/persist<%= table.className %>', component: Persist<%= table.className %> },
        { path: '/persist<%= table.className %><% 
if (table.primaryColumns.length == 1) {
    %>/:id<%
} else {
    for (var k in table.primaryColumns) {
        %>/:<%= table.primaryColumns[k].propertyName %><%
    } 
}
        %>', component: Persist<%= table.className %> },<% 
    } 
} 
%>
        { path: '/', redirect: '/login' },
        { path: '*', redirect: '/home' }
    ]
});