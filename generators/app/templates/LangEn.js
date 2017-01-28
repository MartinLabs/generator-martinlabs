export default {
    "language": "en-us",
    "app": {
        "title": "<%= modulenameUpper %>",
        "logout": "Logout",
        "menu": "Menu",
        "add": "Add",
        "export": "Export",
        "select": "Select",
        "persistedSuccessfully": "Persisted Successfully!",
        "confirmRemove": "Are you sure you want to remove this item?",
        "remove": "Remove",
        "cancel": "Cancel"
    },
    
    "dataTable": {
        "count": "Showing {from} to {to} of {count} records|{count} records|One record",
        "filter": "Filter Results:",
        "filterPlaceholder": "Search query",
        "limit": "Records:",
        "noResults": "No matching records",
        "page": "Page:",
        "filterBy": "Filter by {column}",
        "loading": "Loading...",
        "defaultOption": "Select {column}"

    },
    
    "dateFormat": {
        "millisecond": "YY/MM/DD hh:mm:ss",
        "second": "YY/MM/DD hh:mm:ss",
        "minute": "YY/MM/DD hh:mm",
        "hour": "YY/MM/DD hh:mm",
        "day": "YY/MM/DD hh:mm",
        "week": "YY/MM/DD",
        "month": "YY/MM/DD",
        "quarter": "YY/MM/DD",
        "year": "YY/MM/DD",
        "date": "YYYY/MM/DD",
        "datetime": "YYYY/MM/DD hh:mm",
        "time": "hh:mm",
        "datemask": "####/##/##",
        "datetimemask": "####/##/## ##:##"

    },
    
    "boolean": {
        "true": "True",
        "false": "False"
    },


    "login": {
        "title": "Login",
        "subtitle": "Please sign in",
        "account": "Account",
        "password": "Password",
        "signin": "Sign in"
    },
    
    "home": {
        "title": "Home",
        "subtitle": "Home"
    },

    "persist": {
        "number": "Number",
        "submit": "Submit"
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