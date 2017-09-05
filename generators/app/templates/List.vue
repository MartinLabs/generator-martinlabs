<template>

    <div class="y-scroll">
        <div class="verti">
        
            <div class="horiz h-wrap">
                <h1 class="weight-1">
                    {{ $t("classes.<%= table.className %>.title") }}
                </h1>
                <div class="w-wrap">
                    <button @click="downloadCsv()">{{ $t("app.downloadCsv") }}</button>
                    <router-link to="/persist<%= table.className %>" class="btn accent">{{ $t("app.add") }}</router-link>
                </div>
            </div>

            <section class="verti">

               <div class="horiz mb-10">
                    <adap-searchfield :store="adapStore" :placeholder="$t('app.search')" class="w-200"/>
                    <small v-if="list && list.length" class="offset-1 self-center">{{ $t("app.totalLines", { total: adapStore.count }) }}</small>
                </div>

                <p v-if="!list || !list.length" class="text-center">
                    {{ $t("app.noDataToShow") }}
                </p>

                <div class="x-scroll elevated p-0">
                    <table v-if="list && list.length">
                        <thead>
                            <tr>
                                <th></th>
<% 
for (var i in table.columns) { 
	var c = table.columns[i]; 
    if (c.smartType != "active" && c.smartType != "password") {
%>
                                <th><adap-orderby :store="adapStore" name="<%= c.column_name %>">{{ $t("classes.<%= table.className %>.columns.<%= !c.referencedTable ? c.propertyName : c.notIdPropertyName %>") }}</adap-orderby></th><% 
    }
} 
%>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list">
                                <td>
                                    <a @click="openPersist(item)" class="icon icon-pencil"></a><%
if (table.deactivableColumn) {
%>
                                    <a @click="openRemoveModal(item)" class="icon icon-trash"></a><%
}
%>
                                </td>
<% 
for (var i in table.columns) { 
    var c = table.columns[i];
    if (c.smartType != "active" && c.smartType != "password") {
        if (!c.referencedTable) {
            if (c.data_type === "date") { 
%>
                                <td><span v-if="item.<%= c.propertyName %>">{{ item.<%= c.propertyName %> | moment($t("dateFormat.date")) }}</span></td><% 
            } else if (["time", "datetime", "timestamp"].indexOf(c.data_type) > -1) { 
%>
                                <td><span v-if="item.<%= c.propertyName %>">{{ item.<%= c.propertyName %> | moment($t("dateFormat.datetime")) }}</span></td><% 
            } else if (c.javaType === "Boolean" || c.javaType === "boolean") { 
%>
                                <td>{{ item.<%= c.propertyName %> == null ? null : item.<%= c.propertyName %> ? $t("boolean.true") : $t("boolean.false") }}</td><% 
            } else if (c.javaType === "String") { 
                if (c.smartType === "imageUrl") { 
%>
                                <td><img :src="item.<%= c.propertyName %>" class="img-rounded" style="height: 100px"/></td><%
                } else if (["cpf", "cnpj", "rg", "phone", "cep"].indexOf(c.smartType) != -1) { 
%>
                                <td>{{ item.<%= c.propertyName %> | <%= c.smartType %> }}</td><%
                } else { %>
                                <td>{{ item.<%= c.propertyName %> | truncate("140") }}</td><%
                } 
            } else { 
%>
                                <td>{{ item.<%= c.propertyName %> }}</td><%
            }
        } else { 
%>
                                <td>{{ item.<%= c.notIdPropertyName %> != null && item.<%= c.notIdPropertyName %>.<%= c.referencedTable.primaryColumns[0].propertyName %> != null ? item.<%= c.notIdPropertyName %>.<%= c.referencedTable.primaryColumns[0].propertyName %> : null }}</td><%
        }
    }
}
%>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <adap-pagination :store="adapStore" v-if="list && list.length"></adap-pagination>

            </section>
<% if (table.deactivableColumn) { %>        
            <modal v-if="<%= table.classLowerCamel %>ToRemove != null">
                <div class="verti">
                    <div class="horiz">
                        <h4 class="weight-1 mt-0 mr-10">
                            {{ $t("app.confirmRemove") }}
                        </h4>
                        <a class="close" @click="<%= table.classLowerCamel %>ToRemove = null"></a>
                    </div>
                    <p class="text-center"><% 
    if (table.nameColumn) { 
%>{{ <%= table.classLowerCamel %>ToRemove.<%= table.nameColumn.propertyName %> }}<%
    } else { 
%>
                        {{ 
                            ""
<% 
        for (var j in table.columns) { 
            var r = table.columns[j]; 
            if (r.smartType != "active" && r.smartType != "password") {
%>
                            + (<%= table.classLowerCamel %>ToRemove.<%= r.propertyName %> === undefined ? "" : <%= table.classLowerCamel %>ToRemove.<%= r.propertyName %> + "; ")<% 
            }
        } 
%>
                        }}
                <% 
    }
%></p>
                    <div class="horiz items-center">
                        <button type="button" @click="<%= table.classLowerCamel %>ToRemove = null">{{ $t("app.cancel") }}</button>
                        <button type="button" class="danger ml-10" @click="removeItem()">{{ $t("app.remove") }}</button>
                    </div>
                </div>
            </modal>
<% } %>
        </div>
    </div>
</template>

<script>
  import downloadCsv from '../util/downloadCsv';

  export default {
    name: 'List<%= table.className %>',
    data() {
      return {
        list: [],<%
if (table.deactivableColumn) { %>
        <%= table.classLowerCamel %>ToRemove: null,<%
}
%>
        adapStore: new this.$AdapStore('<%= table.primaryColumns[0].propertyName %>', params => this.populateList(params)),
      };
    },
    mounted() {
      this.adapStore.search();
    },
    methods: {
      populateList(params) {
        this.$resources.<%= table.classLowerCamel %>.query(params).then((resp) => {
          this.list = resp.body.list;
          this.adapStore.setCount(resp.body.count);
        });
      },
      openPersist(item) {
        this.$router.push(`/persist<%= table.className %><%
for (var k in table.primaryColumns) {
    var idp = table.primaryColumns[k];
    if (!idp.referencedTable) {
        %>/${item.<%= idp.propertyName %>}<%
    } else {
        %>/${item.<%= idp.notIdPropertyName %>.<%= idp.referencedTable.primaryColumns[0].propertyName %>}<%
    }
}
                %>`);
      },
      downloadCsv() {
        this.$resources.<%= table.classLowerCamel %>.query({
          query: this.adapStore.query,
          orderBy: this.adapStore.orderBy,
          ascending: this.adapStore.asc,
        }).then((resp) => {
          downloadCsv('<%= table.classLowerCamel %>.csv',
            resp.body.list,
            this.$lang.classes.<%= table.className %>.columns);
        });
      },<%
if (table.deactivableColumn) { %>
      openRemoveModal(item) {
        this.<%= table.classLowerCamel %>ToRemove = item;
      },
      removeItem() {
        this.$resources.<%= table.classLowerCamel %>.delete({<%
if (table.primaryColumns.length == 1) {
%>
          id: this.<%= table.classLowerCamel %>ToRemove.<%= table.primaryColumns[0].propertyName %>,<%
} else {
    for (var k in table.primaryColumns) {
%>
          <%= table.primaryColumns[k].propertyName %>: this.<%= table.classLowerCamel %>ToRemove.<%= table.primaryColumns[k].propertyName %>,<%
    } 
}

%>
        }).then(() => {
          this.list.splice(this.list.indexOf(this.<%= table.classLowerCamel %>ToRemove), 1);
          this.adapStore.count -= 1;
          this.<%= table.classLowerCamel %>ToRemove = null;
        });
      },<%
}
%>
    },
  };
</script>