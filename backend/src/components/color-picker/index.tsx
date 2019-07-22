import React, { forwardRef, useCallback, useState } from 'react';
import './index.scss';
import { IFunction } from '@interfaces';
import { stopPropagation } from '@utils';
import { Popover } from 'antd';
import { ChromePicker } from 'react-color';

interface IProps {
    value?: string;
    disabled?: boolean;
    onChange?: IFunction;
}

const ColorPicker = ({ value, onChange, disabled }: IProps, ref: any) => {
    const [showPicker, setShown] = useState(!disabled);
    const togglePicker = useCallback(() => {
        !disabled && setShown(!showPicker);
    }, [showPicker, disabled, setShown]);
    const onColorChange = useCallback(
        color => {
            onChange && onChange(color.hex);
        },
        [onChange],
    );
    return (
        <Popover
            visible={showPicker}
            trigger={'click'}
            onVisibleChange={togglePicker}
            placement={'rightBottom'}
            overlayClassName={'picker-container'}
            content={
                <div onClick={stopPropagation}>
                    <ChromePicker
                        ref={ref}
                        color={value}
                        onChange={onColorChange}
                        disableAlpha={true}
                    />
                </div>
            }
        >
            <div
                className={'color-picker'}
                onClick={togglePicker}
                style={{ backgroundColor: value }}
            />
        </Popover>
    );
};
export default forwardRef(ColorPicker);
