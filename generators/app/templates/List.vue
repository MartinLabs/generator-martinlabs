<template>

    <default>
        
        <section class="content-header">
            <router-link to="/persist<%= table.className %>" class="pull-right btn btn-success">
                <span class="glyphicon glyphicon-plus"></span> {{ $t("app.add") }}
            </router-link>
            <h1>
                {{ $t("classes.<%= table.className %>.title") }}
            </h1>
        </section>

        <section class="content">
            <div class="box">
                <div class="box-body">

                    <div class="table-responsive">

                        <div class="form-group form-inline">
                            <adap-searchfield :store="adapStore" placeholder="Buscar"/>
                        </div>

                        <table class="table table-striped table-bordered table-hover">
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
                                        <div class="btn-group-vertical" role="group">
                                            <a @click="openPersist(item)" class="btn btn-default"><i class="glyphicon glyphicon-pencil"></i></a><%
if (table.deactivableColumn) {
%>
                                            <a @click="openRemoveDialog(item)" class="btn btn-default"><i class="glyphicon glyphicon-remove"></i></a><%
}
%>
                                        </div>
                                    </td>
<% 
for (var i in table.columns) { 
    var c = table.columns[i];
    if (c.smartType != "active" && c.smartType != "password") {
        if (!c.referencedTable) {
            if (c.data_type === "date") { 
%>
                                    <td>{{ item.<%= c.propertyName %> | moment($t("dateFormat.date")) }}</td><% 
            } else if (["time", "datetime", "timestamp"].indexOf(c.data_type) > -1) { 
%>
                                    <td>{{ item.<%= c.propertyName %> | moment($t("dateFormat.datetime")) }}</td><% 
            } else if (c.javaType === "Boolean" || c.javaType === "boolean") { 
%>
                                    <td>{{ item.<%= c.propertyName %> == null ? null : item.<%= c.propertyName %> ? $t("boolean.true") : $t("boolean.false") }}</td><% 
            } else if (c.javaType === "String") { 
                if (c.smartType === "imageUrl") { 
%>
                                    <td><img :src="item.<%= c.propertyName %>" class="img-rounded" style="height: 100px"/></td><%
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

                        <adap-pagination :store="adapStore"></adap-pagination>

                    </div>

                    

                </div>
            </div>
        </section>
<% if (table.deactivableColumn) { %>        
        <div class="modal" role="dialog" v-if="<%= table.classLowerCamel %>ToRemove != null" style="display: block">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="<%= table.classLowerCamel %>ToRemove = null"><span>&times;</span></button>
                        <h4 class="modal-title">
                            {{ $t("app.confirmRemove") }}
                        </h4>
                    </div>
                    <div slot="modal-body" class="modal-body">
                        
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
                        
                    </div>
                    <div slot="modal-footer" class="modal-footer">
                        <button type="button" class="btn btn-default" @click="<%= table.classLowerCamel %>ToRemove = null">{{ $t("app.cancel") }}</button>
                        <button type="button" class="btn btn-danger" @click="removePrincipal()">{{ $t("app.remove") }}</button>
                    </div>
                </div>
            </div>
        </div>
<% } %>
    </default>

</template>

<script>
import Default from './Default.vue';
import moment from "moment";
import AppResource from '../service/AppResource';
import AppBus from '../service/AppBus';
import AdapOrderby from '../adap-table/orderby.vue';
import AdapPagination from '../adap-table/pagination.vue';
import AdapSearchfield from '../adap-table/searchfield.vue';
import AdapStore from '../adap-table/Store.js';

export default {
    name: "List<%= table.className %>",
    components: { Default, AdapOrderby, AdapPagination, AdapSearchfield },
    data() {
        return {
            list: [], <%
if (table.deactivableColumn) { %>
            <%= table.classLowerCamel %>ToRemove: null,<%
}
%>
            adapStore: new AdapStore("<%= table.primaryColumns[0].propertyName %>", (params) => this.populateList(params))
        };
    }, 
    mounted() {
        this.adapStore.search();
    },
    methods: {
        populateList(params) {
            AppResource.<%= table.classLowerCamel %>.query(params).then((resp) => {
                if (resp.body.success) {
                    this.list = resp.body.data.list;
                    this.adapStore.setCount(resp.body.data.count);
                } else {
                    AppBus.$emit("alert", "danger", resp.body.message, 3000);
                }
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
        }<%
if (table.deactivableColumn) { %>,
        openRemoveDialog(item) {
            this.<%= table.classLowerCamel %>ToRemove = item;
        },
        removePrincipal() {
            AppResource.<%= table.classLowerCamel %>.delete({<% 
if (table.primaryColumns.length == 1) {
%>
            id: this.<%= table.classLowerCamel %>ToRemove.<%= table.primaryColumns[0].propertyName %><%
} else {
    for (var k in table.primaryColumns) {
        %><%= k > 0 ? ',' : '' %>
            <%= table.primaryColumns[k].propertyName %>: this.<%= table.classLowerCamel %>ToRemove.<%= table.primaryColumns[k].propertyName %><%
    } 
}

%>
            }).then((resp) => {
                if (resp.body.success) {
                    this.list.splice(this.list.indexOf(this.<%= table.classLowerCamel %>ToRemove), 1);
                    this.<%= table.classLowerCamel %>ToRemove = null;
                } else {
                    AppBus.$emit("alert", "danger", resp.body.message, 3000);
                }
            });
        }<%
}
%>
    }
}
</script>