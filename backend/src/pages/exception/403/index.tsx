import React, { useCallback } from 'react';
import { generateIcons, Navigator } from '@utils';
import { Button, Icon } from 'antd';

export const Forbidden = () => {
    const backHome = useCallback(Navigator.goto.bind(null, '/index'), []);
    return (
        <div className={'forbidden exception'}>
            <Icon component={generateIcons('forbidden')} />
            <div className={'exception-text'}>
                <h1>403</h1>
                <p>Sorry, you don't have access to this page</p>
                <Button onClick={backHome} type={'primary'}>
                    Back to home
                </Button>
            </div>
        </div>
    );
};
