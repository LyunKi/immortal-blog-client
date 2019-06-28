import { Typography } from 'antd';
import React from 'react';
import './index.scss';
const { Paragraph } = Typography;

const MAP = {
    email: 'mailto',
    phone: 'tel',
};
interface IProps {
    value: string;
    type: 'email' | 'phone';
}
const Association = ({ value, type }: IProps) => {
    const aType = MAP[type];
    return !!value ? (
        <Paragraph className={'association'} copyable={{ text: value }}>
            <a href={`${aType}:${value}`}>{value}</a>
        </Paragraph>
    ) : (
        <span className={'association empty-text'}>--</span>
    );
};

export default Association;
