module.exports = { 
<% 
for (var i in urlConstants) { 
	if (i !== "listPages" && i != "persistPages" && i != "LOGIN" && i != "login" && i != "home") {
%>
	<%= i %>: "<%= urlConstants[i] %>",<% 
	}
}
%>

	<% if (loginsys) { 
		%>
		LOGIN: "../<%= modulenameUpper %>/Login",
		login: "index.html",<%
	 } %>
	home: "home.html",


	listPages: {<% 
    var count = 0;
	for (var j in urlConstants.listPages) { 
		%><%= count > 0 ? "," : "" %>
		<%= j %>: "<%= urlConstants.listPages[j] %>"<% 
		count++;
	} %>},

	persistPages: {<% 
	var count = 0;
	for (var k in urlConstants.persistPages) {
		%><%= count > 0 ? "," : "" %>
		<%= k %>: "<%= urlConstants.persistPages[k] %>"<% 
		count++;
	} 
	%>}
};