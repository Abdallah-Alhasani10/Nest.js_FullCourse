export interface PaginationMetaFormat{
    currentpage:number;
    itemsperpage:number;
    totalItems:number;
    totalPages:number;
    hasPreviousPage:boolean;
    hasNextPage:boolean;
}


export interface PaginatedResponse<T>{
    items:T[];
    meta:PaginationMetaFormat;
}
