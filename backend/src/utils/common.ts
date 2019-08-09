import { IObject } from '@interfaces';
import { message } from 'antd';

export function interpolate(
    text: string,
    context: IObject,
    reg = /{{([^}]+)}}/,
) {
    let result = text;

    while (reg.test(result)) {
        let expr = RegExp.$1;
        let keys = expr.trim().split('.');
        let value: any = context;
        for (let key of keys) {
            value = value[key];
            if (!value) {
                value = '';
                break;
            }
        }
        result = result.replace(reg, value.toString().replace(/\//, '') || '');
    }
    return result;
}

export function beforeUpload(file: IObject) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
}
