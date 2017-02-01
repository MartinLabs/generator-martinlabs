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

                if (col.extra !== "auto_increment" && col.smartType != "createTime" && col.smartType != "updateTime") {

                    if (col.referencedTable) { %>
                        <div class="form-group"<% 
                        if (col.column_key == "PRI") { 
                        %> v-if="!<%= table.classLowerCamel %>.<%= col.notIdPropertyName %>.<%= col.referencedTable.primaryColumns[0].propertyName %>"<% 
                        } %>>
                            <label for="input-<%= col.propertyName %>" 
                                class="control-label required"> 
                                {{ $t("classes.<%= table.className %>.columns.<%= col.notIdPropertyName %>") }}</label>
                            <select id="input-<%= col.propertyName %>"
                                v-model="<%= table.classLowerCamel %>.<%= col.notIdPropertyName %>.<%= col.referencedTable.primaryColumns[0].propertyName %>" 
                                class="form-control" required>
                                <option value="">{{ $t("app.select") }}</option>
                                <option v-for="item in all<%= col.referencedTable.className %>" :value="item.<%= col.referencedTable.primaryColumns[0].propertyName %>">
                                {{ 
                                    ""
                            <% for (var j in col.referencedTable.columns) { 
                                var r = col.referencedTable.columns[j]; 
                                if (r.smartType != "active" && r.smartType != "password") {
                            %>
                                    + (item.<%= r.propertyName %> === undefined ? "" : item.<%= r.propertyName %> + "; ")<% 
                                }
                            } %>
                                }}
                                </option>
                            </select>
                        </div>
                    <% } else if (col.javaType === "String") { 
                        if (col.character_maximum_length <= 255 || col.smartType) {
                    %>
                        <div class="form-group <%= col.is_nullable !== 'YES' ? 'required' : '' %>">
                            <label for="input-<%= col.propertyName %>" 
                                class="control-label"> 
                                {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}</label>
                            <input id="input-<%= col.propertyName %>" 
                                type="<%= col.smartType === 'email' ? 'email' : col.smartType === 'password' ? 'password' : 'text' %>" 
                                v-model="<%= table.classLowerCamel %>.<%= col.propertyName %><%= col.smartType === 'password' ? 'NotEncrypted' : '' %>"
                                class="form-control" <%= col.is_nullable !== "YES" && col.smartType != "password" ? "required" : "" %><% 
                            if (col.smartType === 'password') { %>
                                :placeholder="<%= table.classLowerCamel %>.<%= table.primaryColumns[0].propertyName %> ? $t('app.onlyIfWantChangePassword') : ''"<%
                            }
                                %>>
                        </div>
                    <% 
                        } else {
                    %>
                        <div class="form-group <%= col.is_nullable !== 'YES' ? 'required' : '' %>">
                            <label for="input-<%= col.propertyName %>" 
                                class="control-label"> 
                                {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}</label>
                            <textarea id="input-<%= col.propertyName %>" 
                                v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                                class="form-control" rows="3" <%= col.is_nullable !== "YES" ? "required" : "" %>></textarea>
                        </div>
                    <%
                        }
                    } else if (["Double", "double"].indexOf(col.javaType) > -1) { %>
                        <div class="form-group <%= col.is_nullable !== 'YES' ? 'required' : '' %>">
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
                        <div class="form-group <%= col.is_nullable !== 'YES' ? 'required' : '' %>">
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
                        <div class="form-group <%= col.is_nullable !== 'YES' ? 'required' : '' %>">
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
                        <div class="form-group <%= col.is_nullable !== 'YES' ? 'required' : '' %>">
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
                                        <input type='checkbox' :value='item.<%= col.otherTable.primaryColumns[0].propertyName %>' v-model="<%= col.NtoNtable.classLowerCamel %>Ids">
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
import moment from 'moment';
import sha1 from 'js-sha1';

import AppResource from '../service/AppResource';
import AppBus from '../service/AppBus';
import AppTranslator from '../service/AppTranslator';

import Default from './fragment/Default.vue';

export default {
    name: "Persist<%= table.className %>",
    components: { Default },
    data() {
        return {
            <%= table.classLowerCamel %>: {<%
var colocarVirgula = false;
for (var i in table.columns) { 
    var col = table.columns[i];
    if (col.extra !== "auto_increment" && col.referencedTable) {
                %><%= colocarVirgula ? ',' : '' %>
                <%= col.notIdPropertyName %>: {} <%
        colocarVirgula = true;
    }
}
for (var i in table.NtoNcolumns) { 
    var col = table.NtoNcolumns[i];
                %><%= colocarVirgula ? ',' : '' %>
                <%= col.NtoNtable.classLowerCamel %>: []<%
    colocarVirgula = true;
}
%>
            }<% 
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
        };
    }, 
    computed: {<%
colocarVirgula = false;
for (var i in table.NtoNcolumns) { 
    var col = table.NtoNcolumns[i]; 
    %><%= colocarVirgula ? ',' : '' %><% 
    colocarVirgula = true; 
%>
        <%= col.NtoNtable.classLowerCamel %>Ids: {
            get() {
                var <%= col.NtoNtable.classLowerCamel %>Ids = [];
                for (let item of this.<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>) {
                    <%= col.NtoNtable.classLowerCamel %>Ids.push(item.<%= col.otherTable.primaryColumns[0].propertyName %>);
                }
                return <%= col.NtoNtable.classLowerCamel %>Ids;
            },
            set(val) {
                this.<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %> = [];
                for (let item of val) {
                    this.<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>.push({ <%= col.otherTable.primaryColumns[0].propertyName %>: item });
                }
            }
        }<% 

} 

for (var i in table.columns) { var col = table.columns[i];

    if (col.extra !== "auto_increment") {

        if (col.data_type === "date") {

%><%= colocarVirgula ? ',' : '' %>
<% 
            colocarVirgula = true; 
%>
        <%= col.propertyName %>Rendered: {
            get() {
                return this.renderDate(this.<%= table.classLowerCamel %>.<%= col.propertyName %>);
            },
            set(val) {
                this.<%= table.classLowerCamel %>.<%= col.propertyName %> = this.transformToDate(val);
            }
        }<% 

        } else if (["time", "datetime", "timestamp"].indexOf(col.data_type) > -1) { 
%><%= colocarVirgula ? ',' : '' %><% 
            colocarVirgula = true; 
%>

        <%= col.propertyName %>Rendered: {
            get() {
                return this.renderDatetime(this.<%= table.classLowerCamel %>.<%= col.propertyName %>);
            },
            set(val) {
                this.<%= table.classLowerCamel %>.<%= col.propertyName %> = this.transformToDatetime(val);
            }
        }<% 

        }
    }
} 
%>
    },
    mounted() {
        AppResource.<%= table.classLowerCamel %>.get({<% 
if (table.primaryColumns.length == 1) {
%>
            id: this.$route.params.id || 0<%
} else {
    for (var k in table.primaryColumns) {
        %><%= k > 0 ? ',' : '' %>
            <%= table.primaryColumns[k].propertyName %>: this.$route.params.<%= table.primaryColumns[k].propertyName %> || 0<%
    } 
}

%>
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
        persist(e) {
            e.preventDefault();
<% 
for (var i in table.columns) {
    var c = table.columns[i];
    if (c.smartType === "password") {
%>            
            if (this.<%= table.classLowerCamel %>.<%= c.propertyName %>NotEncrypted && this.<%= table.classLowerCamel %>.<%= c.propertyName %>NotEncrypted.length) {
                if (this.<%= table.classLowerCamel %>.<%= c.propertyName %>NotEncrypted.length < 6) {
                    AppBus.$emit("alert", "danger", AppTranslator.data.app.passwordMustHaveAtleast6Chars, 3000);
                    return;
                }
                
                this.<%= table.classLowerCamel %>.<%= c.propertyName %> = sha1(this.<%= table.classLowerCamel %>.<%= c.propertyName %>NotEncrypted);
            }
<%
    }
} 
%>
            AppResource.<%= table.classLowerCamel %>.save(this.<%= table.classLowerCamel %>).then((resp) => {
                if (resp.body.success) {
                    AppBus.$emit("alert", "success", AppTranslator.data.app.persistedSuccessfully, 3000);
                    this.$router.push("/list<%= table.className %>");
                } else {
                    AppBus.$emit("alert", "danger", resp.body.message, 3000);
                }
            });
        },
        renderDate(date) {
            if (date) {
                return moment(date).format(AppTranslator.data.dateFormat.date);
            } else {
                return null;
            }
        },
        transformToDate(visual) {
            var date = moment(visual, AppTranslator.data.dateFormat.date);
            return date.isValid() ? date.format() : null;
        },
        renderDatetime(date) {
            if (date) {
                return moment(date).format(AppTranslator.data.dateFormat.datetime);
            } else {
                return null;
            }
        },
        transformToDatetime(visual) {
            var date = moment(visual, AppTranslator.data.dateFormat.datetime);
            return date.isValid() ? date.format() : null;
        }
    }
}
</script>