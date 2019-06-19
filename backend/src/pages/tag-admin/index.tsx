import './index.scss';
import React from 'react';
import TagTable from './tag-table';
import Index from './tag-filter-form';

const TagAdmin = () => {
    return (
        <div className={'tag-admin'}>
            <Index />
            <TagTable />
        </div>
    );
};

export default TagAdmin;
