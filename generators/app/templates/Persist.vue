<template>

    <div class="verti">
        <h1 class="header px-30 py-10 m-0">
            {{ $t("classes.<%= table.className %>.title") }}
        </h1>

        <section class="verti scroll weight-1 items-center-top p-30">

            <form @submit.prevent="persist" class="elevated w-full max-w-650 p-20">

<% 
for (var i in table.columns) { 
var col = table.columns[i];

    if (col.extra !== "auto_increment" && col.smartType != "createTime" && col.smartType != "updateTime") {

        if (col.referencedTable) { 
%>
                <select-group <%= col.is_nullable !== "YES" ? "required" : "" %><% 
            if (col.column_key == "PRI") { 
%> 
                    v-if="!<%= table.classLowerCamel %>.<%= col.notIdPropertyName %>.<%= col.referencedTable.primaryColumns[0].propertyName %>"<% 
            } 
%>
                    v-model="<%= table.classLowerCamel %>.<%= col.notIdPropertyName %>.<%= col.referencedTable.primaryColumns[0].propertyName %>">
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
                <input-group <%= col.is_nullable !== "YES" && col.smartType != "password" ? "required" : "" %>
                    type="<%= ['email', 'password', 'cpf', 'cnpj', 'rg', 'phone', 'cep'].indexOf(col.smartType) > -1 ? col.smartType : 'text' %>" 
                    maxlength="<%= col.character_maximum_length %>"
                    v-model="<%= table.classLowerCamel %>.<%= col.propertyName %><%= col.smartType === 'password' ? 'NotEncrypted' : '' %>"<% 
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
                <textarea-group <%= col.is_nullable !== 'YES' ? 'required' : '' %>
                    v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                    rows="3">
                    {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                </textarea-group>
            <%
            }
        } else if (["Double", "double"].indexOf(col.javaType) > -1) { 
        %>
                <input-group <%= col.is_nullable !== "YES" ? "required" : "" %>
                    type="number" 
                    step="any"
                    v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                    :placeholder="$t('persist.number')">
                    {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                </input-group>
                    <% 
        } else if (["Long", "long"].indexOf(col.javaType) > -1) { 
                    %>
                <input-group <%= col.is_nullable !== "YES" ? "required" : "" %>
                    type="number" 
                    step="1"
                    v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                    :placeholder="$t('persist.number')">
                    {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                </input-group>
<% 
        } else if (col.data_type === "date") {
%>
                <input-group <%= col.is_nullable !== "YES" ? "required" : "" %>
                    type="date"
                    v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                    :placeholder="$t('dateFormat.date')">
                    {{ $t("classes.<%= table.className %>.columns.<%= col.propertyName %>") }}
                </input-group>
<% 
        } else if (["time", "datetime", "timestamp"].indexOf(col.data_type) > -1) {
%>
                <input-group <%= col.is_nullable !== "YES" ? "required" : "" %>
                    type='datetime' 
                    v-model="<%= table.classLowerCamel %>.<%= col.propertyName %>"
                    :placeholder="$t('dateFormat.datetime')">
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
                    <template slot="item" slot-scope="props"><%
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

                <hr class="mb-20"/>
                <div class="verti items-center">
                    <button type="submit" class="accent">{{ $t("persist.submit") }}</button>
                </div>
            </form> 
        </section>
    </div>

</template>

<script><%
  var hasPassword = false;
  for (var i in table.columns) {
    if (table.columns[i].smartType === "password") {
      hasPassword = true;
    }
  }
  if (hasPassword) {
%>
  import sha256 from 'js-sha256';<% }
%>
  import <%= table.className %> from '../model/<%= table.className %>';

  export default {
    name: 'Persist<%= table.className %>',
    data() {
      return {
        <%= table.classLowerCamel %>: new <%= table.className %>(),<%
var antiRepeat = [];
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
        all<%= c.referencedTable.className %>: {},<%
    }
}

antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
        all<%= c.otherTable.className %>: {},<%
    }
}
%>
      };
    },
    mounted() {
      this.$resources.<%= table.classLowerCamel %>.get({<%
if (table.primaryColumns.length == 1) {
%>
        id: this.$route.params.id || 0,<%
} else {
    for (var k in table.primaryColumns) {
%>
        <%= table.primaryColumns[k].propertyName %>: this.$route.params.<%= table.primaryColumns[k].propertyName %> || 0,<%
    } 
}

%>
      }).then((resp) => {
        if (resp.body.<%= table.classLowerCamel %>) {
          this.<%= table.classLowerCamel %> = resp.body.<%= table.classLowerCamel %>;
        }<%
var antiRepeat = [];
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
        this.all<%= c.referencedTable.className %> = resp.body.all<%= c.referencedTable.className %>;<%
    }
}

antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
        this.all<%= c.otherTable.className %> = resp.body.all<%= c.otherTable.className %>;<%
    }
}
            %>
      });
    },
    methods: {
      persist() {<%
for (var i in table.columns) {
    var c = table.columns[i];
    if (c.smartType === "password") {
%>
        if (this.<%= table.classLowerCamel %>.<%= c.propertyName %>NotEncrypted && this.<%= table.classLowerCamel %>.<%= c.propertyName %>NotEncrypted.length) {
          if (this.<%= table.classLowerCamel %>.<%= c.propertyName %>NotEncrypted.length < 6) {
            this.$bus.error(this.$lang.app.passwordMustHaveAtleast6Chars, 3000);
            return;
          }

          this.<%= table.classLowerCamel %>.<%= c.propertyName %> = sha256(this.<%= table.classLowerCamel %>.<%= c.propertyName %>NotEncrypted);
        }
<%
    }
} 
%>
        this.$resources.<%= table.classLowerCamel %>.save(this.<%= table.classLowerCamel %>).then(() => {
          this.$bus.success(this.$lang.app.persistedSuccessfully, 3000);
          this.$router.push('/list<%= table.className %>');
        });
      },
    },
  };
</script>