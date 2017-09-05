export default {
  language: 'en-us',
  app: {
    title: 'Crud',
    logout: 'Logout',
    menu: 'Menu',
    add: 'Add',
    export: 'Export',
    select: 'Select',
    persistedSuccessfully: 'Persisted Successfully!',
    confirmRemove: 'Are you sure you want to remove this item?',
    remove: 'Remove',
    cancel: 'Cancel',
    passwordMustHaveAtleast6Chars: 'The password must have atleast 6 characters',
    onlyIfWantChangePassword: 'Fill this field only if you want to change the password',
    noDataToShow: 'No data to show',
    downloadCsv: 'Download CSV',
    search: 'Search',
    totalLines: '{total} total lines',
    version: 'Version',
  },

  dateFormat: {
    millisecond: 'YY/MM/DD hh:mm:ss',
    second: 'YY/MM/DD hh:mm:ss',
    minute: 'YY/MM/DD hh:mm',
    hour: 'YY/MM/DD hh:mm',
    day: 'YY/MM/DD hh:mm',
    week: 'YY/MM/DD',
    month: 'YY/MM/DD',
    quarter: 'YY/MM/DD',
    year: 'YY/MM/DD',
    date: 'YYYY/MM/DD',
    datetime: 'YYYY/MM/DD hh:mm',
    time: 'hh:mm',
    datemask: '####/##/##',
    datetimemask: '####/##/## ##:##',
  },

  format: {
    cpf: '###.###.###-##',
    cnpj: '##.###.###/####-##',
    rg: '##.###.###-#',
    cep: '#####-###',
    phone: '(##) #####-####',
  },

  boolean: {
    true: 'True',
    false: 'False',
  },


  login: {
    title: 'Login',
    subtitle: 'Please sign in',
    account: 'Account',
    password: 'Password',
    signin: 'Sign in',
  },

  home: {
    title: 'Home',
    subtitle: 'Home',
  },

  persist: {
    number: 'Number',
    submit: 'Submit',
  },

  classes: {<%
    for (var i in tables) {
        var t = tables[i];
%>
    <%= t.className %>: {
      title: '<%= t.classNatural %>',
      columns: {<%
        for (var j in t.columns) {
            var c = t.columns[j];
            if (!c.referencedTable) {
%>
        <%= c.propertyName %>: '<%= c.propertyNatural %>',<%
            } else { %>
        <%= c.notIdPropertyName %>: '<%= c.notIdPropertyNatural %>',<%
            }
        }
%>
      },
    },<%
    }
%>
  },
};
