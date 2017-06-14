<template>

    <div>
        
        <section class="content-header">

            <div class="pull-right">
                <a class="btn btn-default" @click="downloadCsv()">{{ $t("app.downloadCsv") }}</a>
                <router-link to="/persist<%= table.className %>" class="btn btn-success">
                    <span class="glyphicon glyphicon-plus"></span> {{ $t("app.add") }}
                </router-link>
            </div>

            <h1>
                {{ $t("classes.<%= table.className %>.title") }}
            </h1>
        </section>

        <section class="content">
            <div class="box">
                <div class="box-body">

                    <div class="table-responsive">

                        <span v-if='list && list.length' class="pull-right">{{ $t("app.totalLines", { total: adapStore.count }) }}</span>

                        <div class="form-group form-inline">
                            <adap-searchfield :store="adapStore" :placeholder="$t('app.search')"/>
                        </div>

                        <p v-if='!list || !list.length' class="text-center">
                            {{ $t("app.noDataToShow") }}
                        </p>

                        <table v-if='list && list.length'  class="table table-striped table-bordered table-hover">

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
                                            <a @click="openRemoveModal(item)" class="btn btn-default"><i class="glyphicon glyphicon-remove"></i></a><%
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

                        <adap-pagination :store="adapStore"></adap-pagination>

                        <hr/>
                        
                        <div v-if='list && list.length' class="row">
<%
for (var i in table.columns) { 
    var c = table.columns[i];
    if (c.javaType === "Date") {
        for (var j in table.columns) {
            var c2 = table.columns[j];
            if (["Double", "double", "Long", "long"].indexOf(c2.javaType) > -1 && !c2.referencedTable && c2.column_key != "PRI") { 
%>
                            <div class="col-sm-6">
                                <h3>{{ $t("classes.<%= table.className %>.columns.<%= c2.propertyName %>") }} x {{ $t("classes.<%= table.className %>.columns.<%= c.propertyName %>") }}</h3>
                                <line-chart :list="list" colXName="<%= c.propertyName %>" colYName="<%= c2.propertyName %>" :height="150"/>
                            </div>
<%
            }
        }
    }
}
%>
                        </div>

                    </div>

                </div>
            </div>
        </section>
<% if (table.deactivableColumn) { %>        
        <modal v-if="<%= table.classLowerCamel %>ToRemove != null">
            <div class="modal-header">
                <button type="button" class="close" @click="<%= table.classLowerCamel %>ToRemove = null"><span>&times;</span></button>
                <h4 class="modal-title">
                    {{ $t("app.confirmRemove") }}
                </h4>
            </div>
            <div class="modal-body"><%
    if (table.nameColumn) { %>
        {{ <%= table.classLowerCamel %>ToRemove.<%= table.nameColumn.propertyName %> }}<%
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
                }}<% 
    }
%>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" @click="<%= table.classLowerCamel %>ToRemove = null">{{ $t("app.cancel") }}</button>
                <button type="button" class="btn btn-danger" @click="removeItem()">{{ $t("app.remove") }}</button>
            </div>
        </modal>
<% } %>
    </div>

</template>

<script>
import moment from "moment";
import downloadCsv from '../util/downloadCsv.js';

export default {
    name: "List<%= table.className %>",
    data() {
        return {
            list: [], <%
if (table.deactivableColumn) { %>
            <%= table.classLowerCamel %>ToRemove: null,<%
}
%>
            adapStore: new this.$AdapStore("<%= table.primaryColumns[0].propertyName %>", (params) => this.populateList(params))
        };
    }, 
    mounted() {
        this.adapStore.search();
    },
    methods: {
        populateList(params) {
            this.$resources.<%= table.classLowerCamel %>.query(params).then(resp => {
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
            downloadCsv("<%= table.classLowerCamel %>.csv",
                this.list,
                this.$lang.classes.<%= table.className %>.columns);

        }<%
if (table.deactivableColumn) { %>,
        openRemoveModal(item) {
            this.<%= table.classLowerCamel %>ToRemove = item;
        },
        removeItem() {
            this.$resources.<%= table.classLowerCamel %>.delete({<% 
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
            }).then(resp => {
                this.list.splice(this.list.indexOf(this.<%= table.classLowerCamel %>ToRemove), 1);
                this.adapStore.count--;
                this.<%= table.classLowerCamel %>ToRemove = null;
            });
        }<%
}
%>
    }
}
</script>