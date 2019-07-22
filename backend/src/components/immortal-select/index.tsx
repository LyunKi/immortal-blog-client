import { Auth } from '@components';
import { Select } from 'antd';
import React, { forwardRef } from 'react';
import { IAuthChecker, IKeyMap } from '@interfaces';
import { SelectProps } from 'antd/lib/select';
import { useFetch } from '@hooks';
import { api } from '@utils';
import { map, toString, isNumber, isArray } from 'lodash';

const Option = Select.Option;
interface IApiFetch {
    apiPath: string;
}
interface ICommonFetch {
    getOptions: (...args: any[]) => Promise<IKeyMap[]>;
}

interface ISelectProps extends SelectProps {
    auth?: IAuthChecker;
    options?: IKeyMap[];
    lazy?: boolean;
}

type ApiProps = IApiFetch & ISelectProps;
type CommonProps = ICommonFetch & ISelectProps;

type IProps = ApiProps | CommonProps;

const ImmortalSelect = (props: IProps, ref: any) => {
    const initialOptions = props.options || [];
    const apiPath = (props as ApiProps).apiPath;
    const fetchOptions = apiPath && api.get.bind(null, apiPath);
    const getOptions = (props as CommonProps).getOptions || fetchOptions;
    const { data: options } = useFetch(initialOptions, getOptions);
    let value = props.value;
    if (isNumber(value)) {
        value = toString(value);
    } else if (isArray(value)) {
        value = map(value, toString);
    }
    return (
        <Auth
            {...props.auth}
            render={
                <Select
                    optionFilterProp={'children'}
                    ref={ref}
                    {...props}
                    value={value}
                >
                    {map(options, option => (
                        <Option key={option.id} value={option.id}>
                            {option.name}
                        </Option>
                    ))}
                </Select>
            }
        />
    );
};

export default forwardRef(ImmortalSelect);
