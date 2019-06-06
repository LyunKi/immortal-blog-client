import React from 'react';
import './index.scss';
import { get } from 'lodash';
import { useStore } from '@hooks';

interface IProps {}

const Home = (props: IProps) => {
    const { user } = useStore(['user']);
    return (
        <div className={'index-container'}>
            Hello {get(user, 'userInfo.nickname', 'stranger')}!
        </div>
    );
};
export default Home;
