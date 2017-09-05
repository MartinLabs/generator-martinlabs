import VueResource from 'vue-resource';
import simpleStorage from 'simplestorage.js';
import { version } from '../../../package.json';

export default {
  install(Vue) {
    Vue.use(VueResource);

    Vue.http.interceptors.push((request, next) => {
      // all requests pass by here

      request.headers.set('Accept-Language', Vue.lang);
      request.headers.set('X-Client-Version', `w${version}`); // w = web

      const token = simpleStorage.get('token<%= modulenameUpper %>') || null;
      if (token) {
        request.headers.set('Authorization', `Bearer ${token}`);
      }

      next((resp) => {
        if (!resp.ok) {
          Vue.$bus.error(resp.body.message, true, 3000);

          if (resp.body.code === 33) {
            simpleStorage.deleteKey('token<%= modulenameUpper %>');
            simpleStorage.set('beforeLoginIntention', location.href);
            Vue.$router.push('/login');
          }
        }
      });
    });

    const apiPath = 'http://localhost:8080/<%= projectName %>/ws';
    const resources = {
      login: Vue.resource(`${apiPath}/<%= modulenameUpper %>/Login`),<%

    for (var i in tables) {
        var table = tables[i];
        if (table.inCrud && !table.isNtoNtable) {
    %>
      <%= table.classLowerCamel %>: Vue.resource(`${apiPath}/<%= modulenameUpper %>/<%= table.className %><% 
if (table.primaryColumns.length == 1) {
    %>{/id}<%
} else {
    for (var k in table.primaryColumns) {
        %>{/<%= table.primaryColumns[k].propertyName %>}<%
    } 
}
        %>`),<%
        }
    }
    %>
    };

    Object.assign(Vue.prototype, { $resources: resources });
    Object.assign(Vue, { $resources: resources });
  },
};
