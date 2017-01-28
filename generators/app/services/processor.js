var lorem = require("./lorem");
var moment = require("moment");

module.exports = {

	projectProps: function(main) {

		main.props.javaFolder = "src/main/java/"+main.props.package.replace(/\./g, '\/');
        main.props.testFolder = "src/test/java/"+main.props.package.replace(/\./g, '\/');
        main.props.daoPackage = main.props.package + ".dao";
        main.props.daoFolder = main.props.javaFolder + "/dao";
        main.props.modelPackage = main.props.package + ".model";
        main.props.modelFolder = main.props.javaFolder + "/model";
        main.props.modelTestFolder = main.props.testFolder + "/model";
        main.props.modulePackage = main.props.package + "." + main.props.modulename;
        main.props.moduleFolder = main.props.javaFolder + "/" + main.props.modulename;
        main.props.moduleTestFolder = main.props.testFolder + "/" + main.props.modulename;
        main.props.processPackage = main.props.modulePackage + ".process";
        main.props.processFolder = main.props.moduleFolder + "/process";
        main.props.processTestFolder = main.props.moduleTestFolder + "/process";
        main.props.responsePackage = main.props.modulePackage + ".response";
        main.props.responseFolder = main.props.moduleFolder + "/response";
        main.props.wsPackage = main.props.modulePackage + ".ws";
        main.props.wsFolder = main.props.moduleFolder + "/ws";
        main.props.modulenameUpper = this.capitalizeFirstLetter(main.props.modulename);
        main.props.datasource = "jdbc/" + main.props.database + "DS";

        if (main.props.tables !== "all tables") {
            main.props.crudTables = main.props.tables.replace(/ /g, "").split(",");
        } else {
            main.props.crudTables = [];
        }

        main.props.tables = [];

	},

	tablesProps: function(main) {
		for (var i in main.props.tables) {
            var table = main.props.tables[i];

            table.className = this.upperCamelCase(table.name);
            table.classUpper = table.className.toUpperCase();
            table.classLowerCamel = this.lowerCamelCase(table.name);
            table.classNatural = this.naturalCase(table.className);

            //marks that main table should have List WS even if it's not choosen to be CRUD
            table.isReferenced = main.props.referencedTables.has(table.name);

            var isLoginTable = false;
            if (table.name === main.props.logintablename) {
                main.logintable = table;
                isLoginTable = true;
            }

            table.primaryColumns = [];
            var primaryIndex = 0;
            for (var k = table.columns.length - 1; k >= 0; k--) {
                var col = table.columns[k];

                //primary key
                if (col.column_key === "PRI") {
                    table.primaryColumns.push(col);
                    col.primaryIndex = primaryIndex;
                    primaryIndex++;
                }

                col.javaType = this.generateJavaType(col);
                col.resultSetGetter = this.generateResultSetGetter(col);
                col.propertyName = this.lowerCamelCase(col.column_name);
                col.propertyNameUpper = this.capitalizeFirstLetter(col.propertyName);
                col.propertyNatural = this.naturalCase(col.propertyName);
                col.notIdPropertyName = this.notIdPkFk(col.propertyName);
                col.notIdPropertyNatural = this.naturalCase(col.notIdPropertyName);
                col.notIdPropertyNameUpper = this.capitalizeFirstLetter(col.notIdPropertyName);
                col.smartType = this.generateSmartType(main, col);

                if (col.smartType === "active") {
                    table.deactivableColumn = col;
                }

                //putting column information on logintable
                if (isLoginTable) {
                    if (col.column_name === main.props.loginaccountcolumn) {
                        main.logintable.accountColumn = col;
                    } else if (col.column_name === main.props.loginpasswordcolumn) {
                        main.logintable.passwordColumn = col;
                    }
                }

                //if the column is a foreign key we will save the referenced table inside the column
                if (col.referenced_table_name) {

                    for (var j in main.props.tables) {
                        var rt = main.props.tables[j];
                        if (col.referenced_table_name === rt.name) {
                            col.referencedTable = rt;
                        }
                    }
                }
            }

            //if the table is referenced in a N to N table
            //we will put the 'virtual' columns with the N to N table information
            //and the other side of N to N table information
            if (main.props.NtoNreferencedTables[table.name]) {
                table.NtoNcolumns = main.props.NtoNreferencedTables[table.name];

                for (var m in table.NtoNcolumns) {
                    var nc = table.NtoNcolumns[m];

                    for (var n in main.props.tables) {
                        var nt = main.props.tables[n];
                        if (nt.name === nc.otherTableName) {
                            nt.isReferenced = true;
                            nc.otherTable = nt;
                        }
                    }
                }
            }

        }
	},

	generateJavaType: function(column) {
        if (["char", "varchar", "text"].indexOf(column.data_type) > -1) {
            return "String";
        }

        else if (["float", "double", "real", "double precision", "numeric", "decimal"].indexOf(column.data_type) > -1) {
            return column.is_nullable === "YES" ? "Double" : "double";
        }

        else if (["int", "integer", "smallint", "mediumint", "bigint"].indexOf(column.data_type) > -1) {
            return column.is_nullable === "YES" ? "Long" : "long";
        }

        else if ("tinyint" === column.data_type) {
            return column.is_nullable === "YES" ? "Boolean" : "boolean";
        }

        else if (["date", "time", "datetime", "timestamp"].indexOf(column.data_type) > -1) {
            return "Date";
        }

        throw new Error("Unkown type " + column.data_type + " for " + column.column_name);

    },

    generateResultSetGetter: function(column) {

        if (["char", "varchar", "text"].indexOf(column.data_type) > -1) {
            return "getString";
        }

        else if (["float", "double", "real", "double precision", "numeric", "decimal"].indexOf(column.data_type) > -1) {
            return column.is_nullable === "YES" ? "getDoubleOrNull" : "getDouble";
        }

        else if (["int", "integer", "smallint", "mediumint", "bigint"].indexOf(column.data_type) > -1) {
            return column.is_nullable === "YES" ? "getLongOrNull" : "getLong";
        }

        else if ("tinyint" === column.data_type) {
            return column.is_nullable === "YES" ? "getBooleanOrNull" : "getBoolean";
        }

        else if (["date", "time", "datetime", "timestamp"].indexOf(column.data_type) > -1) {
            return "getTimestamp";
        }

        throw new Error("Unkown type " + column.data_type + " for " + column.column_name);

    },

    generateDataForColumn: function(column, index) {

        if (column.primaryIndex == 1) { 
            //if it is the second primary it will be counted regulary to avoid duplicate entry
            return index + 1;
        }

        if (column.column_key === "PRI") {
            return index + 1;
        }

        if (column.column_key === "UNI") {
            if (["float", "double", "real", "double precision", "numeric", "decimal"].indexOf(column.data_type) > -1) {
                return index + 1;
            } else if (column.smartType === "email") {
                return "\"" + lorem.unique(index) + "@gmail.com\"";
            } else if (["char", "varchar", "text"].indexOf(column.data_type) > -1) {
                return "\"" + lorem.unique(index) + "\"";
            }
        }

        if (column.referencedTable) {
            if (index == 0) {
                return 1; //the first one is connected with the other first one's
            } else {
                return Math.floor(Math.random() * 50) + 1;
            }
        }

        if (column.smartType === "email") {
            if (index == 0) {
                return "\"user@gmail.com\""; //the first one will be user@gmail.com
            } else {
                return "\"" + lorem(1) + "@gmail.com\"";
            }
        }

        if (column.smartType === "password") {
            return "SHA1(SHA1(\"abcabc\"))";
        }

        if (column.smartType === "imageUrl") {
            return "\"https://unsplash.it/600?image=" + Math.floor(Math.random() * 1000) + "\"";
        }

        if (column.smartType === "url") {
            return "\"" + lorem.url() + "\"";
        }

        if (["char", "varchar", "text"].indexOf(column.data_type) > -1) {
            return "\"" + lorem(Math.min(2000, column.character_maximum_length), index === 0) + "\"";
        }

        else if (["float", "double", "real", "double precision", "numeric", "decimal"].indexOf(column.data_type) > -1) {
            return (Math.random() * 300).toFixed(3);
        }

        else if (["int", "integer", "smallint", "mediumint", "bigint"].indexOf(column.data_type) > -1) {
            return Math.floor(Math.random() * 300);
        }

        else if ("tinyint" === column.data_type) {
            if (index == 0) {
                return 1; //the first one has everything true
            } else {
                return Math.round(Math.random() * 1);
            }
        }

        else if (["date", "time", "datetime", "timestamp"].indexOf(column.data_type) > -1) {
            var minDate = new Date(2012, 0, 1); 
            var maxDate = new Date();
            var date = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()))
            return "\"" + moment(date).format("YYYY-MM-DD HH:mm:ss.000") + "\"";
        }

        throw new Error("Unkown type " + column.data_type + " for " + column.column_name);
    },

    generateSmartType: function(main, column) {

        if (column.data_type === "tinyint" && this.regexTestExactInsensitive(main.props.columnNamePatterns.active, column.column_name)) {
            return "active";
        }

        else if (column.javaType === "String" && this.regexTestExactInsensitive(main.props.columnNamePatterns.email, column.column_name)) {
            return "email";
        }

        else if (column.javaType === "String" && this.regexTestExactInsensitive(main.props.columnNamePatterns.password, column.column_name)) {
            return "password";
        }

        else if (column.javaType === "String" && this.regexTestExactInsensitive(main.props.columnNamePatterns.imageUrl, column.column_name)) {
            return "imageUrl";
        }

        else if (column.javaType === "String" && this.regexTestExactInsensitive(main.props.columnNamePatterns.url, column.column_name)) {
            return "url";
        }

        return null;

    },

    regexTestExactInsensitive: function(r, str) {
        var match = str.match(new RegExp(r, "i"));
        return match != null && str == match[0];
    },

    camelCase: function(string) {
        return string.replace(/_([a-z])/g, function (g) { 
            return g[1].toUpperCase();
        });
    },

    naturalCase: function(string) {
        return this.capitalizeFirstLetter(string.replace(/\.?([A-Z]+)/g, " $1").replace(/^\s/, ""));
    },

    lowerCamelCase: function(string) {
        return this.normalizeFirstLetter(this.camelCase(string));
    },

    upperCamelCase: function(string) {
        return this.capitalizeFirstLetter(this.camelCase(string));
    },

    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    normalizeFirstLetter: function(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    },

    notIdPkFk: function(string) {
        var newStr = string + "";
        if (newStr.charAt(0) === "i" && newStr.charAt(1) === "d") {
            newStr = newStr.slice(2);
        }

        if ((newStr.charAt(newStr.length -2) === "P" || newStr.charAt(newStr.length -2) === "F") && newStr.charAt(newStr.length -1) === "k") {
            newStr = newStr.slice(0, -2);
        }

        return this.normalizeFirstLetter(newStr);
    }

};