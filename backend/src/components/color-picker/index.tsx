import React, { forwardRef, useCallback, useState } from 'react';
import './index.scss';
import { IFunction } from '@interfaces';
import { stopPropagation } from '@utils';
import { Input } from 'antd';

interface IProps {
    value?: string;
    disabled?: boolean;
    onChange?: IFunction;
}

const ColorPicker = forwardRef(({ value, onChange, disabled }: IProps, _) => {
    const [showPicker, setShown] = useState(false);
    const togglePicker = useCallback(
        event => {
            !disabled && setShown(!showPicker);
        },
        [showPicker, disabled, setShown],
    );
    const onColorChange = onChange && useCallback(onChange, []);
    return (
        <div
            className={'color-picker'}
            onClick={togglePicker}
            style={{ backgroundColor: value }}
        >
            {showPicker && (
                <div className={'picker-container'} onClick={stopPropagation}>
                    <Input
                        placeholder={'color'}
                        value={value}
                        onChange={onColorChange}
                    />
                </div>
            )}
        </div>
    );
});
export default ColorPicker;
