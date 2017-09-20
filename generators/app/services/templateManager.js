var templates = require("./templates");

module.exports = {

    write: function(main) {
        for (var i in templates.general) {
            this.general(main, i, templates.general[i]);
        }

        for (var i in templates.copy) {
            this.copy(main, i, templates.copy[i]);
        }

        for (var i in templates.directory) {
            this.directory(main, i, templates.directory[i]);
        }

        for (var i in templates.login) {
            this.table(main, main.logintable, i, templates.login[i]);
        }

        for (var i in main.props.tables) {
            var table = main.props.tables[i];

            if (table.isNtoNtable) {

                for (var i in templates.NtoNtable) {
                    this.table(main, table, i, templates.NtoNtable[i]);
                }

            } else {

                for (var i in templates.table) {
                    this.table(main, table, i, templates.table[i]);
                }

                if (table.inCrud) {

                    for (var i in templates.inCrud) {
                        this.table(main, table, i, templates.inCrud[i]);
                    }

                }
            }
        }
    },

    general: function(main, templateSource, templatePath) {
        main.fs.copyTpl(
            main.templatePath(templateSource),
            main.customDestinationPath(templatePath(main.props)),
            main.props);
    },

    copy: function(main, templateSource, templatePath) {
        main.fs.copy(
            main.templatePath(templateSource),
            main.customDestinationPath(templatePath(main.props)));
    },

    directory: function(main, templateSource, templatePath) {
        main.directory(templateSource, 
            main.customDestinationPath(templatePath(main.props)));
    },

    table: function(main, table, templateSource, templatePath) {
        main.fs.copyTpl(
            main.templatePath(templateSource),
            main.customDestinationPath(templatePath(main.props, table)), {
                props: main.props,
                table: table
            });
    }
}