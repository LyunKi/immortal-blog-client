import './index.scss';
import React from 'react';
import TagTable from './table';
import TagFilterForm from './filter-form';

const TagAdmin = () => {
    return (
        <div className={'tag-admin'}>
            <TagFilterForm />
            <TagTable />
        </div>
    );
};

export default TagAdmin;
