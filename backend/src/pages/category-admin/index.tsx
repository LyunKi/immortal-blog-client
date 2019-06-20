import React from 'react';
import CategoryTable from './table';
import CategoryFilterForm from './filter-form';

const CategoryAdmin = () => {
    return (
        <div className={'category-admin'}>
            <CategoryFilterForm />
            <CategoryTable />
        </div>
    );
};

export default CategoryAdmin;
