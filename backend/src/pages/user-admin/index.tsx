import React from 'react';
import UserTable from './table';
import UserFilterForm from './filter-form';

const UserAdmin = () => {
    return (
        <div className={'category-admin'}>
            <UserFilterForm />
            <UserTable />
        </div>
    );
};

export default UserAdmin;
