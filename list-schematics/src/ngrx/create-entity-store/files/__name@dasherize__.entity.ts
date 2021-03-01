// TODO: Specify ID type and add other entity properties
export interface <%= getEntityInterfaceName(schemaOptions.name) %> {
    id: string | number;
}
<% if(schemaOptions.queryParams) { %>
// TODO: Add query and filter parameters for this entity to this interface
export interface <%= getEntityCriteriaInterfaceName(schemaOptions.name) %> {
    
}
<% } %>
