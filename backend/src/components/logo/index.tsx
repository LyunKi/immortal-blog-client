import './index.scss';
import * as React from 'react';
import { generateImages } from '@utils';
import classnames from 'classnames';

interface IProps {
    className?: string;
}

const Logo = ({ className }: IProps) => (
    <span className={classnames('logo', className)}>
        <img src={generateImages('logo')} alt={'logo'} />
        <h1 className={'logo-text'}>Immortal Blog</h1>
    </span>
);

export default Logo;
