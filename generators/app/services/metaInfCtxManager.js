var fs = require('fs');
var xml2js = require('xml2js');

module.exports = {

	readFromFile: function(main) {
        var done = main.async();

        fs.readFile(main.customDestinationPath('src/main/webapp/META-INF/context.xml'), function(err, data) {
            xml2js.parseString(data, function (err, result) {
                main.props.metaInfCtx = result;
                done();
            });
        });
	},

	fillMissingContent: function(main) {
		if (!main.props.metaInfCtx) {
            main.props.metaInfCtx = {};
        }

        if (!main.props.metaInfCtx.Context) {
            main.props.metaInfCtx.Context = {
                "$": {
                    "antiJARLocking": "true",
                    "path": "/" + main.props.projectName
                }
            };
        }

        if (!main.props.metaInfCtx.Context.Resource) {
            main.props.metaInfCtx.Context.Resource = [];
        }

        var existDs = false;

        if (main.props.metaInfCtx.Context.Resource.length) {
            for (var i in main.props.metaInfCtx.Context.Resource) {
                var r = main.props.metaInfCtx.Context.Resource[i];

                if (r.$ && r.$.name === main.props.datasource) {
                    existDs = true;
                }
            }
        }
        
        if (!existDs) {
            main.props.metaInfCtx.Context.Resource.push({
                "$": {
                    "name": main.props.datasource,
                    "url": "jdbc:mysql://localhost:3306/" + main.props.database,
                    "username": main.props.user,
                    "password": main.props.password,
                    "auth": "Container",
                    "driverClassName": "com.mysql.jdbc.Driver",
                    "factory": "org.apache.commons.dbcp.BasicDataSourceFactory",
                    "initialSize": "1",
                    "maxActive": "3",
                    "maxIdle": "1",
                    "maxWait": "20000",
                    "minEvictableIdleTimeMillis": "3000",
                    "minIdle": "1",
                    "removeAbandonedTimeout": "5",
                    "timeBetweenEvictionRunsMillis": "30000",
                    "type": "javax.sql.DataSource"
                }
            });
        }
	},

    writeToFile: function(main) {
        var metaInfCtxAsXml = new xml2js.Builder().buildObject(main.props.metaInfCtx);

        try {
            fs.mkdirSync(main.customDestinationPath("src"));
        } catch (e) {}
        try {
            fs.mkdirSync(main.customDestinationPath("src/main"));
        } catch (e) {}
        try {
            fs.mkdirSync(main.customDestinationPath("src/main/webapp"));
        } catch (e) {}
        try {
            fs.mkdirSync(main.customDestinationPath("src/main/webapp/META-INF"));
        } catch (e) {}
        
        fs.writeFileSync(main.customDestinationPath("src/main/webapp/META-INF/context.xml"), metaInfCtxAsXml, "utf8");
    }

};