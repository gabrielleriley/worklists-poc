<%= createSelectorsImports(schemaOptions) %>

<%= createStateSelector(name) %>
<%= createEntitySelector(name) %>
<%= createStatusSelectors(name) %>
<%= createDateTimeSelectors(name) %>
<%= createCriteriaSelector(name) %>
<% if(schemaOptions.paginated) { %><%= createPageSelectors(name) %><%}%>