export default {
  language: 'pt-br',
  app: {
    title: 'Crud',
    logout: 'Sair',
    menu: 'Menu',
    add: 'Cadastrar',
    export: 'Exportar',
    select: 'Selecione',
    persistedSuccessfully: 'Salvo com Sucesso!',
    confirmRemove: 'Tem certeza que deseja remover este item?',
    remove: 'Remover',
    cancel: 'Cancelar',
    passwordMustHaveAtleast6Chars: 'A senha deve conter pelo menos 6 caracteres',
    onlyIfWantChangePassword: 'Preencha este campo somente se quiser alterar a senha',
    noDataToShow: 'Nenhum dado para apresentar',
    downloadCsv: 'Baixar CSV',
    search: 'Buscar',
    totalLines: '{total} entradas no total',
    version: 'Versão',
  },

  dateFormat: {
    millisecond: 'DD/MM/YY HH:mm:ss',
    second: 'DD/MM/YY HH:mm:ss',
    minute: 'DD/MM/YY HH:mm',
    hour: 'DD/MM/YY HH:mm',
    day: 'DD/MM/YY HH:mm',
    week: 'DD/MM/YY',
    month: 'DD/MM/YY',
    quarter: 'DD/MM/YY',
    year: 'DD/MM/YY',
    date: 'DD/MM/YYYY',
    datetime: 'DD/MM/YYYY HH:mm',
    time: 'hh:mm',
    datemask: '##/##/####',
    datetimemask: '##/##/#### ##:##',
  },

  format: {
    cpf: '###.###.###-##',
    cnpj: '##.###.###/####-##',
    rg: '##.###.###-#',
    cep: '#####-###',
    phone: '(##) #####-####',
  },

  boolean: {
    true: 'Sim',
    false: 'Não',

  },

  login: {
    title: 'Login',
    subtitle: 'Faça Login',
    account: 'Conta',
    password: 'Senha',
    signin: 'Entrar',
  },

  home: {
    title: 'Home',
    subtitle: 'Home',
  },

  persist: {
    number: 'Numérico',
    datetime: 'Data e Hora',
    submit: 'Enviar',
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
