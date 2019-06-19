import React, { useCallback } from 'react';
import { createLazyForm } from '@utils';
import { observer } from 'mobx-react-lite';
import { FormComponentProps, FormProps } from 'antd/lib/form';
import { Button, Form, Input, Select } from 'antd';
import './index.scss';
import { Link } from 'react-router-dom';
import { useStore } from '@hooks';

const initBlogCreateFormFields = async () => ({
    title: '',
    content: '',
    description: '',
    publishImmediately: false,
    authors: [],
    tags: [],
    categories: [],
});

const Item = Form.Item;
const Option = Select.Option;

const BlogCreateForm = createLazyForm(
    'CreateBlogForm',
    initBlogCreateFormFields,
);
