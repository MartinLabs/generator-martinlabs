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

<% 
for (var i in table.columns) { 
var col = table.columns[i];

    if (col.extra !== "auto_increment" && col.smartType != "createTime" && col.smartType != "updateTime") {

        if (col.referencedTable) { 
%>
                        <select-group<% 
            if (col.column_key == "PRI") { 
                        %> v-if="!<%= table.classLowerCamel %>.<%= col.notIdPropertyName %>.<%= col.referencedTable.primaryColumns[0].propertyName %>"<% 
            } 
%>
                        v-model="<%= table.classLowerCamel %>.<%= col.notIdPropertyName %>.<%= col.referencedTable.primaryColumns[0].propertyName %>"
                        <%= col.is_nullable !== "YES" ? "required" : "" %>>
                            <span slot="label">{{ $t("classes.<%= table.className %>.columns.<%= col.notIdPropertyName %>") }}</span>
                            
                            <option value="">{{ $t("app.select") }}</option>
                            <option v-for="item in all<%= col.referencedTable.className %>" :value="item.<%= col.referencedTable.primaryColumns[0].propertyName %>"><%
            if (col.referencedTable.nameColumn) { %>
                {{ item.<%= col.referencedTable.nameColumn.propertyName %> }}<%
            } else { 
%>
                                {{ 
                                    ""
<% 
                for (var j in col.referencedTable.columns) { 
                    var r = col.referencedTable.columns[j]; 
                    if (r.smartType != "active" && r.smartType != "password") {
%>
                                    + (item.<%= r.propertyName %> === undefined ? "" : item.<%= r.propertyName %> + "; ")<% 
                    }
                } 
                            %>
                                }}<%
            }
%>
                            </option>
                        </select-group>
<% 
        } else if (col.javaType === "String") { 
            if (col.character_maximum_length <= 255 || col.smartType) {
%>
                        <input-group
                            type="<%= ['email', 'password', 'cpf', 'cnpj', 'rg', 'phone', 'cep'].indexOf(col.smartType) > -1 ? col.smartType : 'text' %>" 
                            maxlength="<%= col.character_maximum_length %>"
                            v-model="<%= table.classLowerCamel %>.<%= col.propertyName %><%= col.smartType === 'password' ? 'NotEncrypted' : '' %>"
                            <%= col.is_nullable !== "YES" && col.smartType != "password" ? "required" : "" %><% 
            if (col.smartType === 'password') { 
%>
                            :placeholder="<%= table.classLowerCamel %>.<%= table.primaryColumns[0].propertyName %> ? $t('app.onlyIfWantChangePassword') : ''"<%
            }
                            %>>
                            {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                        </input-group>
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
        } else if (["Double", "double"].indexOf(col.javaType) > -1) { 
        %>
                        <input-group
                            type="number" 
                            step="any"
                            v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                            :placeholder="$t('persist.number')" 
                            <%= col.is_nullable !== "YES" ? "required" : "" %>>
                            {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                        </input-group>
                    <% 
        } else if (["Long", "long"].indexOf(col.javaType) > -1) { 
                    %>
                        <input-group
                            type="number" 
                            step="1"
                            v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                            :placeholder="$t('persist.number')" 
                            <%= col.is_nullable !== "YES" ? "required" : "" %>>
                            {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                        </input-group>
<% 
        } else if (col.data_type === "date") {
%>
                        <input-group 
                            type="date"
                            v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                            :placeholder="$t('dateFormat.date')" 
                            <%= col.is_nullable !== "YES" ? "required" : "" %>>
                            {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                        </input-group>
<% 
        } else if (["time", "datetime", "timestamp"].indexOf(col.data_type) > -1) {
%>
                        <input-group
                            type='datetime' 
                            v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                            :placeholder="$t('dateFormat.datetime')" 
                            <%= col.is_nullable !== "YES" ? "required" : "" %>>
                            {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                        </input-group>
<% 
        } else {
%>
                        <checkbox-group v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>">
                            {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                        </checkbox-group>
            <% 
        }
    } 
} 

for (var i in table.NtoNcolumns) { 
    var col = table.NtoNcolumns[i];
%>
                        <multiselect-group
                            v-model="<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>"
                            :items="all<%= col.otherTable.className %>"
                            propname="<%= col.otherTable.primaryColumns[0].propertyName %>">
                            <span slot="label">{{ $t("classes.<%= col.NtoNtable.className %>.title") }}</span>
                            <template slot="item" scope="props"><%
    if (col.otherTable.nameColumn) { %>
                                {{ props.item.<%= col.otherTable.nameColumn.propertyName %> }}<%
    } else { 
%>
                                {{
                                    ""
<% 
        for (var j in col.otherTable.columns) { 
            var r = col.otherTable.columns[j]; 
%>
                                    + (props.item.<%= r.propertyName %> === undefined ? "" : props.item.<%= r.propertyName %> + "; ")<% 
        } 
%>
                                }}<%
    } 
%>
                            </template>
                        </multiselect-group>
<% 
} 
%>

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
import InputGroup from './fragment/form-group/InputGroup.vue';
import SelectGroup from './fragment/form-group/SelectGroup.vue';
import CheckboxGroup from './fragment/form-group/CheckboxGroup.vue';
import MultiselectGroup from './fragment/form-group/MultiselectGroup.vue';

export default {
    name: "Persist<%= table.className %>",
    components: { Default, InputGroup, SelectGroup, CheckboxGroup, MultiselectGroup },
    data() {
        return {
            <%= table.classLowerCamel %>: {<%
var colocarVirgula = false;
for (var i in table.columns) { 
    var col = table.columns[i];
    if (col.extra !== "auto_increment") {
                %><%= colocarVirgula ? ',' : '' %>
                <%= col.notIdPropertyName %>: <%= col.referencedTable ? '{}' : 'null' %><%
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
        }
    }
}
</script>