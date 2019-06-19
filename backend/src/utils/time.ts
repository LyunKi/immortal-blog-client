import { Moment } from 'moment';

export function formatTimeRange(range?: [Moment, Moment]) {
    return (
        range && {
            start: range[0].format('YYYY-MM-DDTHH:mm:ss'),
            end: range[1].format('YYYY-MM-DDTHH:mm:ss'),
        }
    );
}
