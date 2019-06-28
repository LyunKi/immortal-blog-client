import { IObject } from '@interfaces';

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
