<%= createSelectorsImports(schemaOptions) %>

<%= createStateSelector(name) %>
<%= createEntitySelector(name) %>
<%= createStatusSelectors(name) %>
<% if(schemaOptions.paginated) { %>
<%= createPageSelectors(name) %>
<%}%>