import VueRouter from 'vue-router';
import DefaultBuild from './DefaultBuild'; 

export default function buildRouter(Vue) {
    Vue.use(VueRouter);

    var router = new VueRouter({
        routes: [
            { path: '/home', component: DefaultBuild(require('../controller/Home.vue')) },
            { path: '/login', component: require('../controller/Login.vue') },<% 
for (var i in tables) { 
    var table = tables[i];
    if (table.inCrud && !table.isNtoNtable) {
%>
            { path: '/list<%= table.className %>', component: DefaultBuild(require('../controller/List<%= table.className %>.vue')) },<% 
    } 
} 

for (var i in tables) { 
    var table = tables[i];
    if (table.inCrud && !table.isNtoNtable) {
%>
            { path: '/persist<%= table.className %>', component: DefaultBuild(require('../controller/Persist<%= table.className %>.vue')) },
            { path: '/persist<%= table.className %><% 
if (table.primaryColumns.length == 1) {
    %>/:id<%
} else {
    for (var k in table.primaryColumns) {
        %>/:<%= table.primaryColumns[k].propertyName %><%
    } 
}
        %>', component: DefaultBuild(require('../controller/Persist<%= table.className %>.vue')) },<% 
    } 
} 
%>
            { path: '/', redirect: '/login' },
            { path: '*', redirect: '/home' }
        ]
    });

    router.beforeEach(function (to, from, next) {
      window.scrollTo(0, 0);
      next();
    });

    Vue.$router = router;

    return router;

}