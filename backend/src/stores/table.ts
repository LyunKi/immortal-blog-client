import { RootStore } from '@stores/root';
import { action, computed, observable, runInAction } from 'mobx';
import { PaginationConfig } from 'antd/lib/pagination';
import { api } from '@utils';
import { get as lodashGet, isEmpty, toString } from 'lodash';
import { IChanging, IObject, ISorter, TableResponse } from '@interfaces';
import humps from 'humps';

export interface IConfig<T> {
    pagination?: PaginationConfig;
    sortInfo?: ISorter<T>;
}

export class TableStore<T> {
    private rootStore: RootStore;
    @computed get isChanging() {
        return !!this.changing;
    }
    @computed get datasource() {
        const creatingRow = lodashGet(this.changing, 'record');
        return lodashGet(this.changing, 'type') === 'creating'
            ? [creatingRow, ...this.data]
            : this.data;
    }
    @computed get changeForm() {
        return this.changeFormKey && this.rootStore.forms[this.changeFormKey];
    }
    @observable changing?: IChanging<T>;
    @observable pagination: PaginationConfig = {
        current: 1,
        showTotal: total => `Total ${total} records`,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '20'],
    };
    @observable sortInfo?: ISorter<T>;
    @observable data: T[] = [];
    @observable loading: boolean = false;
    @observable changeFormKey?: string;
    @observable apiPath: string;
    @observable filters?: IObject;
    @observable selectedRowKeys: string[] | number[] = [];

    @action onSelectChange(selectedRowKeys?: string[] | number[]) {
        this.selectedRowKeys = selectedRowKeys || [];
    }

    @action change(changing: IChanging<T>) {
        this.changing = changing;
    }

    @action showLoading = () => {
        this.loading = true;
    };

    @action hideLoading = () => {
        this.loading = false;
    };

    @action cancelChange() {
        this.changing = undefined;
    }

    @action bindForm(key: string) {
        this.changeFormKey = key;
    }

    @action submitFilters(filters: IObject) {
        this.filters = filters;
    }

    @action
    onChange(pagination: PaginationConfig, _: any, sortInfo: ISorter<T>) {
        this.pagination = pagination;
        this.sortInfo = sortInfo;
        this.fetchData();
    }

    @action fetchData() {
        let tableParams: IObject = {
            data: {
                ...this.filters,
            },
            pagination: {
                page: this.pagination.current,
                perPage: this.pagination.pageSize,
            },
        };
        if (this.sortInfo && !isEmpty(this.sortInfo)) {
            tableParams.orders = [
                {
                    field: humps.decamelize(toString(this.sortInfo.field)),
                    order: this.sortInfo.order,
                },
            ];
        }
        this.loading = true;
        api.get<TableResponse<T>>(this.apiPath, { $query: tableParams })
            .then(reply => {
                runInAction(() => {
                    this.data = reply.datasource;
                    this.pagination = {
                        ...this.pagination,
                        total: reply.total,
                        pageSize: reply.perPage,
                        current: reply.page,
                    };
                });
            })
            .finally(() => {
                runInAction(() => {
                    this.loading = false;
                });
            });
    }

    @action setConfig(configs: IConfig<T>) {
        if (configs.pagination) {
            this.pagination = configs.pagination;
        }
        this.sortInfo = configs.sortInfo;
    }

    constructor(rootStore: RootStore, apiPath: string) {
        this.rootStore = rootStore;
        this.apiPath = apiPath;
    }
}
