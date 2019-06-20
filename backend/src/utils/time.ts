import { Moment } from 'moment';
import { isEmpty } from 'lodash';
import { ISO_FORMAT } from '@configs';

export function formatTimeRange(range?: [Moment, Moment]) {
    return !isEmpty(range) && range
        ? {
              start: range[0].format(ISO_FORMAT),
              end: range[1].format(ISO_FORMAT),
          }
        : undefined;
}
