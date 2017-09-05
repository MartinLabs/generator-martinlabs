/* eslint global-require: 0 */
import VueRouter from 'vue-router';

export default function buildRouter(Vue) {
  Vue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      { path: '/login', component: require('../controller/Login.vue') },

      {
        path: '/home',
        component: require('../controller/fragment/Default.vue'),
        children: [<%
for (var i in tables) { 
    var table = tables[i];
    if (table.inCrud && !table.isNtoNtable) {
%>
          { path: '/list<%= table.className %>', component: require('../controller/List<%= table.className %>.vue') },<%
    } 
} 

for (var i in tables) { 
    var table = tables[i];
    if (table.inCrud && !table.isNtoNtable) {
%>
          { path: '/persist<%= table.className %>', component: require('../controller/Persist<%= table.className %>.vue') },
          { path: '/persist<%= table.className %><%
if (table.primaryColumns.length == 1) {
    %>/:id<%
} else {
    for (var k in table.primaryColumns) {
        %>/:<%= table.primaryColumns[k].propertyName %><%
    } 
}
        %>', component: require('../controller/Persist<%= table.className %>.vue') },<% 
    } 
} 
%>
        ],
      },
      { path: '/', redirect: '/login' },
      { path: '*', redirect: '/home' },
    ],
  });

  router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
    next();
  });

  Object.assign(Vue, { $router: router });

  return router;
}
