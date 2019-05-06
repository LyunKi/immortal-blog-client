import { Form as AntForm } from 'antd';

//Provide a easier way to create a form
export const createForm = (Form: any) => AntForm.create({})(Form);
