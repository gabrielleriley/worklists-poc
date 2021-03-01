<%= createSelectorsImports(schemaOptions) %>

<%= createStateSelector(name) %>
<%= createEntitySelector(name) %>
<%= createStatusSelectors(name) %>
<%= createDateTimeSelectors(name) %>
<% if(schemaOptions.queryParams) { %><%= createCriteriaSelector(name) %><%}%>
<% if(schemaOptions.paginated) { %><%= createPageSelectors(name) %><%}%>
