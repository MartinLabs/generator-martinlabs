var fs = require('fs');
var xml2js = require('xml2js');

module.exports = {

	readFromFile: function(main) {
        var done = main.async();

        fs.readFile(main.customDestinationPath('pom.xml'), function(err, data) {
            xml2js.parseString(data, function (err, result) {
                var resp = {};

                if (result) {
                    main.props.pom = result;
                    main.props.package = result.project.groupId[0];
                    main.props.projectName = result.project.artifactId[0];
                }

                done();
            });
        });
    },

	fillMissingContent: function(main) {
		if (!main.props.pom) {
            main.props.pom = {
                project: {
                    "$": {
                        xmlns: "http://maven.apache.org/POM/4.0.0",
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "xsi:schemaLocation": "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
                    },
                    modelVersion: ["4.0.0"],
                    groupId: [main.props.package],
                    artifactId: [main.props.projectName],
                    version: ["1.0.0"],
                    packaging: ["war"],
                    name: [main.props.projectName],
                    properties: [{
                        "endorsed.dir": ["${project.build.directory}/endorsed"],
                        "project.build.sourceEncoding": ["UTF-8"],
                        "kotlin.version": "1.1.51"
                    }]
                }
            };
        }

        if (!main.props.pom.project.dependencies) {
            main.props.pom.project.dependencies = [{}];
        }

        if (!main.props.pom.project.dependencies[0].dependency) {
            main.props.pom.project.dependencies[0].dependency = [];
        }

        var dependenciesToAdd = [{
            groupId: ["br.com.martinlabs"],
            artifactId: ["martinlabs-commons"],
            version: ["3.4"],
            type: ["jar"]
        }, {
            groupId: ["org.glassfish.jersey.containers"],
            artifactId: ["jersey-container-servlet"],
            version: ["2.15"]
        }, {
            groupId: ["org.zalando.phrs"],
            artifactId: ["jersey-media-json-gson"],
            version: ["0.1"]
        }, {
            groupId: ["javax"],
            artifactId: ["javaee-web-api"],
            version: ["7.0"],
            scope: ["provided"]
        }, {
            groupId: ["io.swagger"],
            artifactId: ["swagger-jersey2-jaxrs"],
            version: ["1.5.10"],
            scope: ["compile"]
        }, {
            groupId: ["org.jetbrains.kotlin"],
            artifactId: ["kotlin-runtime"],
            version: ["${kotlin.version}"],
            scope: ["compile"]
        }, {
            groupId: ["org.jetbrains.kotlin"],
            artifactId: ["kotlin-stdlib-jre8"],
            version: ["${kotlin.version}"]
        }, {
            groupId: ["org.jetbrains.kotlin"],
            artifactId: ["kotlin-test"],
            version: ["${kotlin.version}"],
            scope: ["test"]
        }, {
            groupId: ["org.jetbrains.kotlin"],
            artifactId: ["kotlin-reflect"],
            version: ["${kotlin.version}"]
        }];
        
        for (var i in dependenciesToAdd) {
            var dta = dependenciesToAdd[i];
            var exist = false;
            for (var j in main.props.pom.project.dependencies[0].dependency) {
                var d = main.props.pom.project.dependencies[0].dependency[j];

                if (dta.groupId[0] === d.groupId[0] && dta.artifactId[0] === d.artifactId[0]) {
                    exist = true;
                }
            }

            if (!exist) {
                main.props.pom.project.dependencies[0].dependency.push(dta);
            }
        }

        if (!main.props.pom.project.build) {
            main.props.pom.project.build = [{}];
        }

        main.props.pom.project.build[0].finalName = [main.props.projectName];

        if (!main.props.pom.project.build[0].plugins) {
            main.props.pom.project.build[0].plugins = [{}];
        }

        if (!main.props.pom.project.build[0].plugins[0].plugin) {
            main.props.pom.project.build[0].plugins[0].plugin = [];
        }

        var pluginsToAdd = [{
            groupId: ["org.apache.maven.plugins"],
            artifactId: ["maven-compiler-plugin"],
            version: ["3.1"],
            configuration: [{
                source: ["1.8"],
                target: ["1.8"],
                compilerArguments: [{
                    endorseddirs: ["${endorsed.dir}"]
                }]
            }]
        }, {
            groupId: ["org.apache.maven.plugins"],
            artifactId: ["maven-war-plugin"],
            version: ["2.3"],
            configuration: [{
                failOnMissingWebXml: ["false"],
                warSourceExcludes: [".sass-cache/**, node_modules/**"]
            }]
        }, {
            groupId: ["org.apache.maven.plugins"],
            artifactId: ["maven-dependency-plugin"],
            version: ["2.6"],
            executions: [{
                execution: [{
                    phase: ["validate"],
                    goals: [{
                        goal: ["copy"]
                    }],
                    configuration: [{
                        outputDirectory: ["${endorsed.dir}"],
                        silent: ["true"],
                        artifactItems: [{
                            artifactItem: [{
                                groupId: ["javax"],
                                artifactId: ["javaee-endorsed-api"],
                                version: ["7.0"],
                                type: ["jar"]
                            }]
                        }]
                    }]
                }]
            }]
        }, {
            groupId: ["org.jacoco"],
            artifactId: ["jacoco-maven-plugin"],
            version: ["0.7.1.201405082137"],
            executions: [{
                execution: [
                    {
                        goals: [{ goal: ["prepare-agent"] }]
                    },
                    {
                          id: ["report"],
                          phase: ["prepare-package"],
                          goals: [{ goal: ["report"] }]
                    },
                    {
                        id: ["check"],
                        goals: [{ goal: ["check"] }],
                        configuration: [{
                            rules: [{
                                rule: [{
                                    "$": { implementation: "org.jacoco.maven.RuleConfiguration" },
                                    element: ["BUNDLE"]
                                }]
                            }],
                            excludes: [{
                                exclude: [
                                    "**/Router.*"
                                ]
                            }]
                        }]
                    }
                ]
            }]
        },
        {
            groupId: ["org.jetbrains.kotlin"],
            artifactId: ["kotlin-maven-plugin"],
            version: ["${kotlin.version}"],
            executions: [{
                execution: [
                    {
                        id: ["compile"],
                        goals: [{ goal: ["compile"] }],
                        configuration: [{
                            sourceDirs: [{
                                sourceDir: ["${project.basedir}/src/main/kotlin", "${project.basedir}/src/main/java"]
                            }]
                        }]
                    },
                    {
                        id: ["test-compile"],
                        goals: [{ goal: ["test-compile"] }],
                        configuration: [{
                            sourceDirs: [{
                                sourceDir: ["${project.basedir}/src/test/kotlin", "${project.basedir}/src/test/java"]
                            }]
                        }]
                    }
                ]
            }]
        }
];

        for (var i in pluginsToAdd) {
            var bta = pluginsToAdd[i];
            var exist = false;
            for (var j in main.props.pom.project.build[0].plugins[0].plugin) {
                var b = main.props.pom.project.build[0].plugins[0].plugin[j];

                if (b.groupId && b.artifactId && bta.groupId[0] === b.groupId[0] && bta.artifactId[0] === b.artifactId[0]) {
                    exist = true;

                    if (bta.configuration && bta.configuration.length) { 
                        if (bta.configuration[0].source) {
                            b.configuration[0].source = bta.configuration[0].source;
                            b.configuration[0].target = bta.configuration[0].target;
                        }

                        if (bta.configuration[0].warSourceExcludes) {
                            b.configuration[0].warSourceExcludes = bta.configuration[0].warSourceExcludes;
                        }
                    }
                }
            }

            if (!exist) {
                main.props.pom.project.build[0].plugins[0].plugin.push(bta);
            }
        }
	},

	writeToFile: function(main) {
		var pomAsXml = new xml2js.Builder().buildObject(main.props.pom);
        fs.writeFileSync(main.customDestinationPath("pom.xml"), pomAsXml, "utf8");
	}

};