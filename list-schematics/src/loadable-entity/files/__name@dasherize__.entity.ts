export const select<%= capitalize(name) %>Id = (entity) => entity.id;

export interface I<%= classify(name) %>Entity {
    id: string | number;
}

<% if(queryParams) { %>
export interface I<%= classify(name) %>QueryCriteria {
    sortColumn: string;
    direction: string;
}   
<% } %>