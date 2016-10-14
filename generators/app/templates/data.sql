SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

USE <%= database %>;

<% 

for (var i in tables) { 
var table = tables[i]; 

%>
LOCK TABLES `<%= table.name %>` WRITE;

INSERT INTO `<%= table.name %>` 
(<% 

	for (var j in table.columns) { 
		var c = table.columns[j]; 

	%><%= c.column_name %><%= j < table.columns.length -1 ? ',' : '' %><% 

} 

%>) VALUES 
<% 

for (var k = 0; k < 50; k++) { 

%>(<% 

	for (var m in table.columns) { 
	var c2 = table.columns[m]; 

	%><%- generateDataForColumn(c2, k) %><%= m < table.columns.length -1 ? ',' : '' %><% 

} 

%>)<%= k < 49 ? ',' : '' %><% 

} 

%>;

UNLOCK TABLES;
<% 

} 

%>

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
