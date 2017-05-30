var processor = require("./processor");

module.exports = {

	javaClasses: function(main) {

        main.fs.copyTpl(
            main.templatePath('ServerListener.java'),
            main.customDestinationPath(main.props.javaFolder+"/ServerListener.java"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('ErrorCode.java'),
            main.customDestinationPath(main.props.javaFolder+"/ErrorCode.java"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('GsonContextResolver.java'),
            main.customDestinationPath(main.props.javaFolder+"/GsonContextResolver.java"), 
            main.props);

        main.fs.copyTpl(
            main.templatePath('DateParameterConverterProvider.java'),
            main.customDestinationPath(main.props.javaFolder+"/DateParameterConverterProvider.java"), 
            main.props);

        main.fs.copyTpl(
            main.templatePath('Router.java'),
            main.customDestinationPath(main.props.moduleFolder+"/Router.java"), 
            main.props);

        main.fs.copyTpl(
            main.templatePath('OtherTest.java'),
            main.customDestinationPath(main.props.testFolder+"/OtherTest.java"), 
            main.props);

        for (var i in main.props.tables) {
            var table = main.props.tables[i];

            var params = {
                props: main.props,
                table: table
            };

            if (table.isNtoNtable) {

                main.fs.copyTpl(
                    main.templatePath('DaoNtoN.java'),
                    main.customDestinationPath(main.props.daoFolder+"/"+table.className+"Dao.java"),
                    params);

            } else { 

                main.fs.copyTpl(
                    main.templatePath('Model.java'),
                    main.customDestinationPath(main.props.modelFolder+"/"+table.className+".java"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('ModelTest.java'),
                    main.customDestinationPath(main.props.modelTestFolder+"/"+table.className+"Test.java"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('Dao.java'),
                    main.customDestinationPath(main.props.daoFolder+"/"+table.className+"Dao.java"),
                    params);

                if (table.inCrud) {

                    main.fs.copyTpl(
                        main.templatePath('Process.java'),
                        main.customDestinationPath(main.props.processFolder+"/"+table.className+"Process.java"),
                        params);

                    main.fs.copyTpl(
                        main.templatePath('ProcessTest.java'),
                        main.customDestinationPath(main.props.processTestFolder+"/"+table.className+"ProcessTest.java"),
                        params);

                    main.fs.copyTpl(
                        main.templatePath('Response.java'),
                        main.customDestinationPath(main.props.responseFolder+"/"+table.className+"Resp.java"),
                        params);

                }
            }
        }        

        var paramsLogin = {
            props: main.props,
            table: main.logintable
        };

        main.fs.copyTpl(
            main.templatePath('LoginServiceDao.java'),
            main.customDestinationPath(main.props.daoFolder+"/LoginServiceDao.java"),
            paramsLogin);

        main.fs.copyTpl(
            main.templatePath('LoginServices.java'),
            main.customDestinationPath(main.props.processFolder+"/LoginServices.java"),
            paramsLogin);

        main.fs.copyTpl(
            main.templatePath('LoginServicesTest.java'),
            main.customDestinationPath(main.props.processTestFolder+"/LoginServicesTest.java"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('LoginResp.java'),
            main.customDestinationPath(main.props.responseFolder+"/LoginResp.java"),
            main.props);
    },

    jsClasses: function(main) {
        main.fs.copy(
            main.templatePath('index.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/index.js"));

        main.fs.copy(
            main.templatePath('AppBus.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppBus.js"));

        main.fs.copy(
            main.templatePath('AppTranslator.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppTranslator.js"));

        main.fs.copy(
            main.templatePath('AppFilter.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppFilter.js"));

        main.fs.copy(
            main.templatePath('App.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/App.vue"));

        main.fs.copy(
            main.templatePath('Home.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/Home.vue"));

        main.fs.copy(
            main.templatePath('pagination.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/adap-table/pagination.vue"));

        main.fs.copy(
            main.templatePath('orderby.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/adap-table/orderby.vue"));

        main.fs.copy(
            main.templatePath('searchfield.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/adap-table/searchfield.vue"));

        main.fs.copy(
            main.templatePath('Store.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/adap-table/Store.js"));

        main.fs.copy(
            main.templatePath('CheckboxGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/form-group/CheckboxGroup.vue"));

        main.fs.copy(
            main.templatePath('SelectGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/form-group/SelectGroup.vue"));

        main.fs.copy(
            main.templatePath('MultiselectGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/form-group/MultiselectGroup.vue"));

        main.fs.copy(
            main.templatePath('TextareaGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/form-group/TextareaGroup.vue"));

        main.fs.copy(
            main.templatePath('InputGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/form-group/InputGroup.vue"));

        main.fs.copy(
            main.templatePath('InputGroupMixin.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/form-group/InputGroupMixin.js"));

        main.fs.copy(
            main.templatePath('LineChart.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/LineChart.vue"));

        main.fs.copy(
            main.templatePath('LoadBox.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/LoadBox.vue"));

        main.fs.copy(
            main.templatePath('Modal.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/Modal.vue"));

        main.fs.copyTpl(
            main.templatePath('Default.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/Default.vue"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('Login.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/Login.vue"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('AppResource.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppResource.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('AppRouter.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppRouter.js"),
            main.props);

        main.fs.copy(
            main.templatePath('downloadCsv.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/util/downloadCsv.js"));

        main.fs.copy(
            main.templatePath('Gruntfile.js'),
            main.customDestinationPath("src/main/webapp/Gruntfile.js"));

        for (var i in main.props.tables) {
            var table = main.props.tables[i];

            if (table.inCrud && !table.isNtoNtable) {
                var params = {
                    props: main.props,
                    table: table
                };

                main.fs.copyTpl(
                    main.templatePath('Model.js'),
                    main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/model/"+table.className+".js"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('List.vue'),
                    main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/List"+table.className+".vue"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('Persist.vue'),
                    main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/Persist"+table.className+".vue"),
                    params);
            }
        }
    },

    scssFiles: function(main) {
        main.fs.copy(
            main.templatePath('template.scss'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/scss/template.scss"));

        main.fs.copy(
            main.templatePath('crud.scss'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/scss/" + main.props.modulename + ".scss"));
    },

    htmlFiles: function(main) {
        main.fs.copyTpl(
            main.templatePath('index.html'),
            main.customDestinationPath("src/main/webapp/" + main.props.modulename + "/index.html"),
            main.props);
    },

    otherFiles: function(main) {

        main.fs.copy(
            main.templatePath('logging.properties'),
            main.customDestinationPath("src/main/resources/logging.properties"));

        main.fs.copy(
            main.templatePath('version.properties'),
            main.customDestinationPath("src/main/resources/version.properties"));

        main.fs.copy(
            main.templatePath('.babelrc'),
            main.customDestinationPath("src/main/webapp/.babelrc"));

        main.fs.copy(
            main.templatePath('.babelrc'),
            main.customDestinationPath("src/main/webapp/.babelrc"));

        main.directory("fonts", 
            main.customDestinationPath("src/main/webapp/" + main.props.modulename + "/fonts"));

        main.fs.copyTpl(
            main.templatePath('LangEn.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/const/LangEn.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('LangPt.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/js/const/LangPt.js"),
            main.props);

        main.props.generateDataForColumn = processor.generateDataForColumn;

        main.fs.copyTpl(
            main.templatePath('data.sql'),
            main.customDestinationPath("src/test/resources/database/data.sql"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('web.xml'),
            main.customDestinationPath("src/main/webapp/WEB-INF/web.xml"),
            main.props);
        
    }

}