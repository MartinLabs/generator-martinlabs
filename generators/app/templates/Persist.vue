<template>

    <Default>
        <section class="content-header">
            <h1>
                {{ $t("classes.<%= table.className %>.title") }}
            </h1>
        </section>

        <section class="content">
            <div class="box col-sm-9">
                <div class="box-body">

                    <form @submit="persist" role="form">

            <% for (var i in table.columns) { var col = table.columns[i];

                if (col.extra !== "auto_increment") {

                    if (col.referencedTable) { %>
                        <div class="form-group">
                            <label for="input-<%= col.propertyName %>" 
                                class="control-label"> 
                                {{ $t("classes.<%= table.className %>.columns.<%= col.notIdPropertyName %>") }}</label>
                            <select id="input-<%= col.propertyName %>"
                                v-model="<%= table.classLowerCamel %>.<%= col.notIdPropertyName %>.<%= col.referencedTable.idColumn.propertyName %>" 
                                class="form-control" required>
                                <option value="">{{ $t("app.select") }}</option>
                                <option v-for="item in all<%= col.referencedTable.className %>" :value="item.<%= col.referencedTable.idColumn.propertyName %>">
                                {{ 
                                    ""
                                <% for (var j in col.referencedTable.columns) { var r = col.referencedTable.columns[j]; %>
                                    + (item.<%= r.propertyName %> === undefined ? "" : item.<%= r.propertyName %> + "; ")<% 
                                } %>
                                }}
                                </option>
                            </select>
                        </div>
                    <% } else if (col.javaType === "String") { %>
                        <div class="form-group">
                            <label for="input-<%= col.propertyName %>" 
                                class="control-label"> 
                                {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}</label>
                            <input id="input-<%= col.propertyName %>" 
                                type="text" 
                                v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                                class="form-control" <%= col.is_nullable !== "YES" ? "required" : "" %>>
                        </div>
                    <% } else if (["Double", "double"].indexOf(col.javaType) > -1) { %>
                        <div class="form-group">
                            <label for="input-<%= col.propertyName %>" 
                                class="control-label">
                                {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}</label>
                            <input id="input-<%= col.propertyName %>" 
                                type="number" step="any"
                                v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                                :placeholder="$t('persist.number')" 
                                class="form-control" <%= col.is_nullable !== "YES" ? "required" : "" %>>
                        </div>
                    <% } else if (["Long", "long"].indexOf(col.javaType) > -1) { %>
                        <div class="form-group">
                            <label for="input-<%= col.propertyName %>" 
                                class="control-label">
                                {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}</label>
                            <input id="input-<%= col.propertyName %>" 
                                type="number" step="1"
                                v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                                :placeholder="$t('persist.number')" 
                                class="form-control" <%= col.is_nullable !== "YES" ? "required" : "" %>>
                        </div>
                    <% } else if (col.data_type === "date") { %>
                        <div class="form-group">
                            <label for="input-<%= col.propertyName %>" 
                                class="control-label">
                                {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}</label>
                            <input 
                                id="input-<%= col.propertyName %>" 
                                type='text' 
                                v-model.lazy="<%= col.propertyName %>Rendered"
                                v-mask="$t('dateFormat.datemask')"
                                :placeholder="$t('dateFormat.date')" 
                                class="form-control" <%= col.is_nullable !== "YES" ? "required" : "" %>/>
                        </div>
                    <% } else if (["time", "datetime", "timestamp"].indexOf(col.data_type) > -1) { %>
                        <div class="form-group">
                            <label class="control-label">
                                {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}</label>
                            <input 
                                id="input-<%= col.propertyName %>" 
                                type='text' 
                                v-model.lazy="<%= col.propertyName %>Rendered"
                                v-mask="$t('dateFormat.datetimemask')"
                                :placeholder="$t('dateFormat.datetime')" 
                                class="form-control" <%= col.is_nullable !== "YES" ? "required" : "" %>/>
                        </div>
                    <% } else { %>
                        <div class="form-group">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox"
                                    v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>">
                                    {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                                </label>
                            </div>
                        </div>
            <% 
                    }
                } 
            } 

            for (var i in table.NtoNcolumns) { 
                var col = table.NtoNcolumns[i];
            %>
                        <div class="form-group">
                            <label>{{ $t("classes.<%= col.NtoNtable.className %>.title") }}</label>
                            <div>
                                <div v-for="item in all<%= col.otherTable.className %>" class='checkbox'>
                                    <label>
                                        <input type='checkbox' :value='item.<%= col.otherTable.idColumn.propertyName %>' v-model="<%= col.NtoNtable.classLowerCamel %>Ids">
                                        {{
                                        ""
                                        <% for (var j in col.otherTable.columns) { var r = col.otherTable.columns[j]; %>
                                            + (item.<%= r.propertyName %> === undefined ? "" : item.<%= r.propertyName %> + "; ")<% 
                                        } %>
                                        }}
                                    </label>
                                </div>
                            </div>
                        </div>
            <% } %>

                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">{{ $t("persist.submit") }}</button>
                        </div>
                    </form> 
                </div>
            </div>
        </section>
    </Default>

</template>

<script>
import Default from './Default.vue';
var simpleStorage = require('simpleStorage.js');
import moment from 'moment';
import AppResource from '../service/AppResource';
import AppBus from '../service/AppBus';
var AppTranslator = require('../service/AppTranslator').default;

export default {
    name: "Persist<%= table.className %>",
    components: { Default },
    data: function() {
        return {
            <%= table.classLowerCamel %>: { grupoDoPrincipal: {}, tagPrincipal: [] }<% 
            var antiRepeat = [];
            for (var i in table.columns) { 
                var c = table.columns[i]; 
                if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
                    antiRepeat.push(c.referencedTable.className);
            %>,
                    all<%= c.referencedTable.className %>: {}<%
                }
            }

            antiRepeat = [];
            for (var i in table.NtoNcolumns) { 
                var c = table.NtoNcolumns[i]; 
                if (antiRepeat.indexOf(c.otherTable.className) < 0) {
                    antiRepeat.push(c.otherTable.className);
            %>,
                    all<%= c.otherTable.className %>: {}<%
                }
            }
            %>
        }
    }, 
    computed: {<%
var colocarVirgula = false;
for (var i in table.NtoNcolumns) { 
    colocarVirgula = true;
    var col = table.NtoNcolumns[i]; %>
        <%= col.NtoNtable.classLowerCamel %>Ids: {
            get: function() {
                var <%= col.NtoNtable.classLowerCamel %>Ids = [];
                for (let item of this.<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>) {
                    <%= col.NtoNtable.classLowerCamel %>Ids.push(item.<%= col.otherTable.idColumn.propertyName %>);
                }
                return tagPrincipalIds;
            },
            set: function(val) {
                this.<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %> = [];
                for (let item of val) {
                    this.<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>.push({ <%= col.otherTable.idColumn.propertyName %>: item });
                }
            }
        }
<% } 

for (var i in table.columns) { var col = table.columns[i];

    if (col.extra !== "auto_increment") {

        if (col.data_type === "date") {

%><%= colocarVirgula ? ',' : '' %>

        <%= col.propertyName %>Rendered: {
            get: function() {
                return this.renderDate(this.<%= table.classLowerCamel %>.<%= col.propertyName %>);
            },
            set: function(val) {
                this.<%= table.classLowerCamel %>.<%= col.propertyName %> = this.transformToDate(val);
            }
        }<% 

        } else if (["time", "datetime", "timestamp"].indexOf(col.data_type) > -1) { 
%><%= colocarVirgula ? ',' : '' %>

        <%= col.propertyName %>Rendered: {
            get: function() {
                return this.renderDatetime(this.<%= table.classLowerCamel %>.<%= col.propertyName %>);
            },
            set: function(val) {
                this.<%= table.classLowerCamel %>.<%= col.propertyName %> = this.transformToDatetime(val);
            }
        }<% 

        }
    }
} %>
    },
    mounted: function() {
        var id = this.$route.params.id || 0;
        AppResource.<%= table.classLowerCamel %>.get({ 
            id: id<% if (props.loginsys) { %>,
            token: simpleStorage.get("token<%= props.modulenameUpper %>") || null<% } %>
        }).then((resp) => {
            if (resp.body.success) {
                if (resp.body.data.<%= table.classLowerCamel %>) {
                    this.<%= table.classLowerCamel %> = resp.body.data.<%= table.classLowerCamel %>;
                }<% 
            var antiRepeat = [];
            for (var i in table.columns) { 
                var c = table.columns[i]; 
                if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
                    antiRepeat.push(c.referencedTable.className);
            %>
                    this.all<%= c.referencedTable.className %> = resp.body.data.all<%= c.referencedTable.className %>;<%
                }
            }

            antiRepeat = [];
            for (var i in table.NtoNcolumns) { 
                var c = table.NtoNcolumns[i]; 
                if (antiRepeat.indexOf(c.otherTable.className) < 0) {
                    antiRepeat.push(c.otherTable.className);
            %>
                    this.all<%= c.otherTable.className %> = resp.body.data.all<%= c.otherTable.className %>;<%
                }
            }
            %>
            } else {
                AppBus.$emit("alert", "danger", resp.body.message, 3000);
            }
        });
    },
    methods: {
        persist: function(e) {
            e.preventDefault();

            AppResource.<%= table.classLowerCamel %>.save({
                content: this.<%= table.classLowerCamel %><% if (props.loginsys) { %>,
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null<% } %>
            }).then((resp) => {
                if (resp.body.success) {
                    this.$router.push("/list<%= table.className %>");
                } else {
                    AppBus.$emit("alert", "danger", resp.body.message, 3000);
                }
            });
        },
        renderDate: function(date) {
            if (date) {
                return moment(date).format(AppTranslator.data.dateFormat.date);
            } else {
                return null;
            }
        },
        transformToDate: function(visual) {
            return moment(visual, AppTranslator.data.dateFormat.date).format();
        },
        renderDatetime: function(date) {
            if (date) {
                return moment(date).format(AppTranslator.data.dateFormat.datetime);
            } else {
                return null;
            }
        },
        transformToDatetime: function(visual) {
            return moment(visual, AppTranslator.data.dateFormat.datetime).format();
        }
    }
}
</script>