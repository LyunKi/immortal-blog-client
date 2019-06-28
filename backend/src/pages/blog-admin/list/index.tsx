import './index.scss';
import React from 'react';
import BlogTable from './table';
import BlogFilterForm from './filter-form';

const BlogList = () => {
    return (
        <div className={'blog-admin'}>
            <BlogFilterForm />
            <BlogTable />
        </div>
    );
};

export default BlogList;
