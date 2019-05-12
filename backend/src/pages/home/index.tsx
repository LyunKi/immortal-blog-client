import React from 'react';
import './index.scss';

interface IProps {}

const Home = (props: IProps) => {
    console.warn(props);
    return <div className={'index-container'}>123</div>;
};
export default Home;
