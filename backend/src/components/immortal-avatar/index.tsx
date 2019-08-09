import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Icon, Upload } from 'antd';
import { IFunction, IObject } from '@interfaces';
import { api, beforeUpload } from '@utils';
import './index.scss';

interface IProps {
    value?: string;
    onChange?: IFunction;
}

const ImmortalAvatar = ({ value, onChange }: IProps, ref: any) => {
    const [loading, setLoading] = useState(false);
    const uploadButton = useMemo(() => {
        return (
            <div className={'upload-button'}>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className='ant-upload-text'>Upload</div>
            </div>
        );
    }, [loading]);
    const handleChange = useCallback(
        info => {
            if (info.file.status === 'uploading') {
                setLoading(true);
                return;
            }
            if (info.file.status === 'done') {
                onChange && onChange(info.file.response[0]);
            }
        },
        [onChange],
    );
    const customRequest = useCallback((info: IObject) => {
        const file = info.file;
        api.upload([file], {
            onUploadProgress: (progressEvent: any) => {
                const percent =
                    (progressEvent.loaded / progressEvent.total) | 0;
                info.onProgress({ percent: percent });
            },
        })
            .then(urls => {
                info.onSuccess(urls);
            })
            .catch(info.onError)
            .finally(setLoading.bind(null, false));
    }, []);
    return (
        <div className={'immortal-avatar'}>
            <Upload
                ref={ref}
                name='avatar'
                accept={'image/*'}
                multiple={false}
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                customRequest={customRequest}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                {value ? <img src={value} alt='avatar' /> : uploadButton}
            </Upload>
        </div>
    );
};

export default forwardRef(ImmortalAvatar);
