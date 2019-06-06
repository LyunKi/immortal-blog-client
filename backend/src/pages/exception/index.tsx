import React from 'react';
import { IExceptionStatus } from '@interfaces';
import { Forbidden } from './403';
import { NotFound } from './404';
import './index.scss';

interface IProps {
    match: {
        params: {
            status: IExceptionStatus;
        };
    };
}

const Exception = ({
    match: {
        params: { status },
    },
}: IProps) => {
    switch (status) {
        case '403':
            return <Forbidden />;
        case '404':
            return <NotFound />;
    }
};

export default Exception;
