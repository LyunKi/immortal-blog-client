export interface ISorter<T> {
    field: keyof T;
    order: 'descend' | 'ascend';
}

export interface IChanging<T> {
    type: 'modifying' | 'creating';
    record: T;
}

export interface TableResponse<T> {
    datasource: T[];
    total: number;
    perPage: number;
    page: number;
}
