var processor = require("./processor");

module.exports = {

	javaClasses: function(main) {

        main.fs.copyTpl(
            main.templatePath('ServerListener.java'),
            main.destinationPath(main.props.javaFolder+"/ServerListener.java"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('ErrorCode.java'),
            main.destinationPath(main.props.javaFolder+"/ErrorCode.java"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('GsonContextResolver.java'),
            main.destinationPath(main.props.javaFolder+"/GsonContextResolver.java"), 
            main.props);

        main.fs.copyTpl(
            main.templatePath('Router.java'),
            main.destinationPath(main.props.moduleFolder+"/Router.java"), 
            main.props);

        main.fs.copyTpl(
            main.templatePath('OtherTest.java'),
            main.destinationPath(main.props.testFolder+"/OtherTest.java"), 
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
                    main.destinationPath(main.props.daoFolder+"/"+table.className+"Dao.java"),
                    params);

            } else { 

                main.fs.copyTpl(
                    main.templatePath('Model.java'),
                    main.destinationPath(main.props.modelFolder+"/"+table.className+".java"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('ModelTest.java'),
                    main.destinationPath(main.props.modelTestFolder+"/"+table.className+"Test.java"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('Dao.java'),
                    main.destinationPath(main.props.daoFolder+"/"+table.className+"Dao.java"),
                    params);

                if (table.inCrud) {

                    main.fs.copyTpl(
                        main.templatePath('Process.java'),
                        main.destinationPath(main.props.processFolder+"/"+table.className+"Process.java"),
                        params);

                    main.fs.copyTpl(
                        main.templatePath('ProcessTest.java'),
                        main.destinationPath(main.props.processTestFolder+"/"+table.className+"ProcessTest.java"),
                        params);

                    main.fs.copyTpl(
                        main.templatePath('Response.java'),
                        main.destinationPath(main.props.responseFolder+"/"+table.className+"Resp.java"),
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
            main.destinationPath(main.props.daoFolder+"/LoginServiceDao.java"),
            paramsLogin);

        main.fs.copyTpl(
            main.templatePath('LoginServices.java'),
            main.destinationPath(main.props.processFolder+"/LoginServices.java"),
            paramsLogin);

        main.fs.copyTpl(
            main.templatePath('LoginServicesTest.java'),
            main.destinationPath(main.props.processTestFolder+"/LoginServicesTest.java"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('LoginResp.java'),
            main.destinationPath(main.props.responseFolder+"/LoginResp.java"),
            main.props);
    },

    jsClasses: function(main) {
        main.fs.copy(
            main.templatePath('index.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/index.js"));

        main.fs.copy(
            main.templatePath('AppBus.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppBus.js"));

        main.fs.copy(
            main.templatePath('AppTranslator.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppTranslator.js"));

        main.fs.copy(
            main.templatePath('AppFilter.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppFilter.js"));

        main.fs.copy(
            main.templatePath('App.vue'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/App.vue"));

        main.fs.copy(
            main.templatePath('Home.vue'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/Home.vue"));

        main.fs.copy(
            main.templatePath('pagination.vue'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/adap-table/pagination.vue"));

        main.fs.copy(
            main.templatePath('orderby.vue'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/adap-table/orderby.vue"));

        main.fs.copy(
            main.templatePath('searchfield.vue'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/adap-table/searchfield.vue"));

        main.fs.copy(
            main.templatePath('Store.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/adap-table/Store.js"));

        main.fs.copy(
            main.templatePath('LineChart.vue'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/LineChart.vue"));

        main.fs.copyTpl(
            main.templatePath('Default.vue'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/fragment/Default.vue"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('AppResource.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppResource.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('AppRouter.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/service/AppRouter.js"),
            main.props);

        main.fs.copy(
            main.templatePath('downloadCsv.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/util/downloadCsv.js"));

        main.fs.copy(
            main.templatePath('Gruntfile.js'),
            main.destinationPath("src/main/webapp/Gruntfile.js"));

        for (var i in main.props.tables) {
            var table = main.props.tables[i];

            if (table.inCrud && !table.isNtoNtable) {
                var params = {
                    props: main.props,
                    table: table
                };

                main.fs.copyTpl(
                    main.templatePath('List.vue'),
                    main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/List"+table.className+".vue"),
                    params);

                main.fs.copyTpl(
                    main.templatePath('Persist.vue'),
                    main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/Persist"+table.className+".vue"),
                    params);
            }
        }

        if (main.props.loginsys) {
            main.fs.copyTpl(
                main.templatePath('Login.vue'),
                main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/controller/Login.vue"),
                main.props);
        }
    },

    scssFiles: function(main) {
        main.fs.copy(
            main.templatePath('template.scss'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/scss/template.scss"));

        main.fs.copy(
            main.templatePath('crud.scss'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/scss/" + main.props.modulename + ".scss"));
    },

    htmlFiles: function(main) {
        main.fs.copyTpl(
            main.templatePath('index.html'),
            main.destinationPath("src/main/webapp/" + main.props.modulename + "/index.html"),
            main.props);
    },

    otherFiles: function(main) {

        main.fs.copy(
            main.templatePath('logging.properties'),
            main.destinationPath("src/main/resources/logging.properties"));

        main.fs.copy(
            main.templatePath('version.properties'),
            main.destinationPath("src/main/resources/version.properties"));

        main.fs.copy(
            main.templatePath('.babelrc'),
            main.destinationPath("src/main/webapp/.babelrc"));

        main.fs.copy(
            main.templatePath('.babelrc'),
            main.destinationPath("src/main/webapp/.babelrc"));

        main.directory("fonts", "src/main/webapp/" + main.props.modulename + "/fonts");

        main.fs.copyTpl(
            main.templatePath('LangEn.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/const/LangEn.js"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('LangPt.js'),
            main.destinationPath("src/main/webapp/src/" + main.props.modulename + "/js/const/LangPt.js"),
            main.props);

        main.props.generateDataForColumn = processor.generateDataForColumn;

        main.fs.copyTpl(
            main.templatePath('data.sql'),
            main.destinationPath("src/test/resources/database/data.sql"),
            main.props);

        main.fs.copyTpl(
            main.templatePath('web.xml'),
            main.destinationPath("src/main/webapp/WEB-INF/web.xml"),
            main.props);
        
    }

}