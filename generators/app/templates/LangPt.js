export default {
    "language": "pt-br",
    "app": {
        "title": "<%= modulenameUpper %>",
        "logout": "Sair",
        "menu": "Menu",
        "add": "Adicionar",
        "export": "Exportar",
        "select": "Selecione",
        "persistedSuccessfully": "Salvo com Sucesso!",
        "confirmRemove": "Tem certeza que deseja remover este item?",
        "remove": "Remover",
        "cancel": "Cancelar",
        "passwordMustHaveAtleast6Chars": "A senha deve conter pelo menos 6 caracteres",
        "onlyIfWantChangePassword": "Preencha este campo somente se quiser alterar a senha"
    },
    
    "dataTable": {
        "count": "Mostrando de {from} à {to} de {count} resultados|{count} resultados|Um resultado",
        "filter": "Filtrar Resultados:",
        "filterPlaceholder": "Buscar",
        "limit": "Resultados:",
        "noResults": "Nenhum Resultado",
        "page": "Página:",
        "filterBy": "Filtrar por {column}",
        "loading": "Carregando...",
        "defaultOption": "Selecione {column}"

    },
    
    "dateFormat": {
        "millisecond": "DD/MM/YY HH:mm:ss",
        "second": "DD/MM/YY HH:mm:ss",
        "minute": "DD/MM/YY HH:mm",
        "hour": "DD/MM/YY HH:mm",
        "day": "DD/MM/YY HH:mm",
        "week": "DD/MM/YY",
        "month": "DD/MM/YY",
        "quarter": "DD/MM/YY",
        "year": "DD/MM/YY",
        "date": "DD/MM/YYYY",
        "datetime": "DD/MM/YYYY hh:mm",
        "time": "hh:mm",
        "datemask": "##/##/####",
        "datetimemask": "##/##/#### ##:##"
    },
    
    "boolean": {
        "true": "Sim",
        "false": "Não"

    },
    
    "login": {
        "title": "Login",
        "subtitle": "Faça Login",
        "account": "Conta",
        "password": "Senha",
        "signin": "Entrar"
    },
    
    "home": {
        "title": "Home",
        "subtitle": "Home"
    },

    "persist": {
        "number": "Numérico",
        "datetime": "Data e Hora",
        "submit": "Enviar"
    },
    
    "classes": {<% 
    for (var i in tables) { 
        var t = tables[i]; 
        %><%= i > 0 ? "," : "" %>
        "<%= t.className %>": {
            "title": "<%= t.classNatural %>",
            "columns": {<% 
        for (var j in t.columns) { 
            var c = t.columns[j]; 
            %><%= j > 0 ? "," : "" %><% 
            if (!c.referencedTable) {
        %>
                "<%= c.propertyName %>": "<%= c.propertyNatural %>"<% 
            } else { %>
                "<%= c.notIdPropertyName %>": "<%= c.notIdPropertyNatural %>"<% 
            }
        }
        %>
            }
        }<% 
    } 
    %>
    }
};