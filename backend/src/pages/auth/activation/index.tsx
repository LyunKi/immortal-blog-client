import React, { useEffect, useState } from 'react';
import { repeat } from 'lodash';
import './index.scss';
import { ApiAction } from '@apis';
import { Navigator, refreshStorageInfo } from '@utils';

interface IProps {
    token: string;
}

const Activation = (props: IProps) => {
    const [dotNum, setDotNum] = useState(1);
    const { token } = props;
    useEffect(() => {
        let initial = dotNum;
        const listener = setInterval(() => {
            initial = (initial + 1) % 4;
            setDotNum(initial);
        }, 200);
        ApiAction.activeUser(token).then(info => {
            refreshStorageInfo(info);
            Navigator.goto('/user-settings');
        });
        return () => clearInterval(listener);
        // eslint-disable-next-line
    }, []);
    return (
        <div className={'activation'}>
            <div className={'item'}>
                Your account is activating,please wait {repeat('.', dotNum)}
            </div>
            <div className={'item'}>
                After activated,the page will jump to login page automatically!
            </div>
        </div>
    );
};

export default Activation;
