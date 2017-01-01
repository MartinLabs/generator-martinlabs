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
                                	<% 
                                	for (var i in table.columns) { 
                                		var c = table.columns[i]; 
                                	%>
                                    <th><adap-orderby :store="adapStore" name="<%= c.column_name %>">{{ $t("classes.<%= table.className %>.columns.<%= !c.referencedTable ? c.propertyName : c.notIdPropertyName %>") }}</adap-orderby></th><% } %>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list" @click="openPersist(item)">
                                	<% 
						        	for (var i in table.columns) { 
						                var c = table.columns[i]; 
						                if (!c.referencedTable) {
						                    if (c.data_type === "date") { %>
                                    <td>{{ item.<%= c.propertyName %> | moment($t("dateFormat.date")) }}</td><% 
                                            } else if (["time", "datetime", "timestamp"].indexOf(c.data_type) > -1) { %>
                                    <td>{{ item.<%= c.propertyName %> | moment($t("dateFormat.datetime")) }}</td><% 
						                    } else if (c.javaType === "Boolean" || c.javaType === "boolean") { %>
                                    <td>{{ item.<%= c.propertyName %> == null ? null : item.<%= c.propertyName %> ? $t("boolean.true") : $t("boolean.false") }}</td><% 
						                    } else if (c.javaType === "String") { 
                                                if (c.smartType === "imageUrl") { %>
                                    <td><img :src="item.<%= c.propertyName %>" class="img-rounded" style="height: 100px"/></td><%
                                                } else { %>
                                    <td>{{ item.<%= c.propertyName %> | truncate("140") }}</td><%
                                                } 
                                            } else { %>
                                    <td>{{ item.<%= c.propertyName %> }}</td><%
						                    }
						                } else { %>
                                    <td>{{ item.<%= c.notIdPropertyName %> != null && item.<%= c.notIdPropertyName %>.<%= c.referencedTable.primaryColumns[0].propertyName %> != null ? item.<%= c.notIdPropertyName %>.<%= c.referencedTable.primaryColumns[0].propertyName %> : null }}</td><%
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
    </default>

</template>

<script>
import Default from './Default.vue';
import simpleStorage from 'simpleStorage.js';
import _ from 'lodash';
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
            list: [],
            adapStore: new AdapStore("<%= table.primaryColumns[0].propertyName %>", (params) => this.populateList(params))
        };
    }, 
    mounted() {
        this.adapStore.search();
    },
    methods: {
        populateList(params) {
            AppResource.<%= table.classLowerCamel %>.query(_.assign({<% if (props.loginsys) { %> 
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null<% } %>
            }, params)).then((resp) => {
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
        }
    },
  
    filters: {

        truncate(string, value) {
            if (string && string.length > value) {
                return string.substring(0, value) + '...';
            } else {
                return string;
            }
        }

    }
}
</script>

<style lang="sass" scoped>
    tbody tr {
        cursor: pointer;
    }
</style>