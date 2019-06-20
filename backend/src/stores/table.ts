import { RootStore } from '@stores';
import { action, computed, observable, runInAction } from 'mobx';
import { PaginationConfig } from 'antd/lib/pagination';
import { api } from '@utils';
import { get as lodashGet, isEmpty, toString } from 'lodash';
import {
    IChanging,
    IFunction,
    IObject,
    ISorter,
    TableResponse,
} from '@interfaces';
import humps from 'humps';
import { message } from 'antd';

export interface IConfig<T> {
    pagination?: PaginationConfig;
    sortInfo?: ISorter<T>;
}

export class TableStore<T> {
    private rootStore: RootStore;
    @computed get isChanging() {
        return !!this.changing;
    }
    @computed get changingType() {
        return lodashGet(this.changing, 'type');
    }
    @computed get changingRecord() {
        return lodashGet(this.changing, 'record');
    }
    @computed get datasource() {
        const creatingRow = lodashGet(this.changing, 'record');
        return this.changingType === 'creating'
            ? [creatingRow, ...this.data]
            : this.data;
    }
    @computed get changeForm() {
        return this.changeFormKey && this.rootStore.forms[this.changeFormKey];
    }

    @computed get loading() {
        return (
            this.tableLoading || (!!this.changeForm && this.changeForm.loading)
        );
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
    @observable tableLoading: boolean = false;
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
        this.tableLoading = true;
    };

    @action hideLoading = () => {
        this.tableLoading = false;
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

    @action confirmAction(
        successAction?: (reply: T) => any,
        failAction?: IFunction,
        borrowValue?: IFunction,
    ) {
        if (!this.changing) {
            return;
        }
        if (this.changing.type === 'modifying') {
            //@ts-ignore
            this.changeForm.put(successAction, failAction, borrowValue);
        } else {
            //@ts-ignore
            this.changeForm.post(successAction, failAction, borrowValue);
        }
    }

    @action delete(ids: any[]) {
        this.showLoading();
        api.delete(this.apiPath, { $query: { ids } })
            .then(num => {
                message.success(`Successfully delete ${num} records`);
                runInAction(() => {
                    this.pagination.current = 1;
                });
                this.fetchData();
            })
            .finally(this.hideLoading);
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
        this.showLoading();
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
                    this.selectedRowKeys = [];
                });
            })
            .finally(this.hideLoading);
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
