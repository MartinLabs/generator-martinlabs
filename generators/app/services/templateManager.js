module.exports = {

	javaClasses: function(main) {

        main.fs.copyTpl(
            main.templatePath('ErrorCode.java'),
            main.customDestinationPath(main.props.javaFolder+"/ErrorCode.java"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('AppProvider.java'),
            main.customDestinationPath(main.props.javaFolder+"/AppProvider.java"), 
            main.props);

        main.fs.copyTpl(
            main.templatePath('SwaggerInit.java'),
            main.customDestinationPath(main.props.javaFolder+"/SwaggerInit.java"), 
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
            main.templatePath('main.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/main.js"));

        main.fs.copy(
            main.templatePath('AppBus.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/service/AppBus.js"));

        main.fs.copy(
            main.templatePath('AppTranslator.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/service/AppTranslator.js"));

        main.fs.copy(
            main.templatePath('AppFilter.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/service/AppFilter.js"));

        main.fs.copy(
            main.templatePath('App.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/App.vue"));

        main.fs.copy(
            main.templatePath('Home.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/Home.vue"));

        main.fs.copy(
            main.templatePath('fragment_index.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/index.js"));

        main.fs.copy(
            main.templatePath('LineChart.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/LineChart.vue"));

        main.fs.copy(
            main.templatePath('Modal.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/Modal.vue"));

        main.fs.copyTpl(
            main.templatePath('Default.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/Default.vue"),
            main.props);

        main.fs.copy(
            main.templatePath('adap-table_index.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/adap-table/index.js"));

        main.fs.copy(
            main.templatePath('pagination.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/adap-table/pagination.vue"));

        main.fs.copy(
            main.templatePath('orderby.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/adap-table/orderby.vue"));

        main.fs.copy(
            main.templatePath('searchfield.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/adap-table/searchfield.vue"));

        main.fs.copy(
            main.templatePath('Store.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/adap-table/Store.js"));

        main.fs.copy(
            main.templatePath('form-group_index.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/form-group/index.js"));

        main.fs.copy(
            main.templatePath('CheckboxGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/form-group/CheckboxGroup.vue"));

        main.fs.copy(
            main.templatePath('SelectGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/form-group/SelectGroup.vue"));

        main.fs.copy(
            main.templatePath('MultiselectGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/form-group/MultiselectGroup.vue"));

        main.fs.copy(
            main.templatePath('TextareaGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/form-group/TextareaGroup.vue"));

        main.fs.copy(
            main.templatePath('InputGroup.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/form-group/InputGroup.vue"));

        main.fs.copy(
            main.templatePath('InputGroupMixin.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/fragment/form-group/InputGroupMixin.js"));

        main.fs.copyTpl(
            main.templatePath('Login.vue'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/Login.vue"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('AppResource.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/service/AppResource.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('AppRouter.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/service/AppRouter.js"),
            main.props);

        main.fs.copy(
            main.templatePath('downloadCsv.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/util/downloadCsv.js"));


        for (var i in main.props.tables) {
            var table = main.props.tables[i];

            if (table.inCrud && !table.isNtoNtable) {
                var params = {
                    props: main.props,
                    table: table
                };

                main.fs.copyTpl(
                    main.templatePath('Model.js'),
                    main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/model/"+table.className+".js"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('List.vue'),
                    main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/List"+table.className+".vue"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('Persist.vue'),
                    main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/controller/Persist"+table.className+".vue"),
                    params);
            }
        }
    },

    otherFiles: function(main) {
        main.fs.copy(
            main.templatePath('base.scss'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/scss/base.scss"));

        main.fs.copy(
            main.templatePath('main.scss'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/scss/main.scss"));

        main.fs.copyTpl(
            main.templatePath('package.json'),
            main.customDestinationPath("src/main/webapp/package.json"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('entries.json'),
            main.customDestinationPath("src/main/webapp/config/entries.json"),
            main.props);

        main.fs.copy(
            main.templatePath('logging.properties'),
            main.customDestinationPath("src/main/resources/logging.properties"));

        main.fs.copy(
            main.templatePath('version.properties'),
            main.customDestinationPath("src/main/resources/version.properties"));

        main.fs.copy(
            main.templatePath('.gitignore'),
            main.customDestinationPath(".gitignore"));

        main.fs.copy(
            main.templatePath('.babelrc'),
            main.customDestinationPath("src/main/webapp/.babelrc"));

        main.fs.copy(
            main.templatePath('.eslintignore'),
            main.customDestinationPath("src/main/webapp/.eslintignore"));

        main.fs.copy(
            main.templatePath('.eslintrc.js'),
            main.customDestinationPath("src/main/webapp/.eslintrc.js"));

        main.fs.copy(
            main.templatePath('.postcssrc.js'),
            main.customDestinationPath("src/main/webapp/.postcssrc.js"));

        main.fs.copyTpl(
            main.templatePath('template.html'),
            main.customDestinationPath("src/main/webapp/template.html"),
            main.props);

        main.directory("docs", 
            main.customDestinationPath("src/main/webapp/docs"));

        main.directory("build", 
            main.customDestinationPath("src/main/webapp/build"));

        main.fs.copyTpl(
            main.templatePath('config/dev.env.js'),
            main.customDestinationPath("src/main/webapp/config/dev.env.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('config/prod.env.js'),
            main.customDestinationPath("src/main/webapp/config/prod.env.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('config/beta.env.js'),
            main.customDestinationPath("src/main/webapp/config/beta.env.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('config/index.js'),
            main.customDestinationPath("src/main/webapp/config/index.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('LangEn.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/locale/LangEn.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('LangPt.js'),
            main.customDestinationPath("src/main/webapp/src/" + main.props.modulename + "/locale/LangPt.js"),
            main.props);

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