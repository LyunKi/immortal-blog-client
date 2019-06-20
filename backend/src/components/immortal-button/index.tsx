import { Auth } from '@components';
import { Button, Popconfirm, Tooltip } from 'antd';
import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import { IInnerProps, IButtonProps } from '@interfaces';

const InnerButton = ({
    disabled,
    text,
    icon,
    tip = {},
    className,
    type,
    onClick,
    loading,
    href,
}: IInnerProps) => {
    const innerButtonClassName = classnames(className, 'immortal-button');
    return (
        <Tooltip title={tip.title} placement={tip.placement}>
            <Button
                icon={icon}
                loading={loading}
                className={innerButtonClassName}
                disabled={disabled}
                type={type}
                href={href}
                onClick={onClick}
            >
                {text}
            </Button>
        </Tooltip>
    );
};

const ImmortalButton = ({
    auth,
    confirm,
    action,
    button,
    disabled,
}: IButtonProps) => {
    const buttonProps = { ...button, disabled };
    const [visible, setVisible] = useState(false);
    const onVisibleChange = useCallback(() => {
        setVisible(!visible);
    }, [visible, setVisible]);
    return (
        <Auth
            {...auth}
            render={
                confirm ? (
                    <Popconfirm
                        overlayClassName={confirm.className}
                        placement={confirm.placement}
                        title={confirm.title}
                        onConfirm={action}
                        visible={!disabled && visible}
                        onVisibleChange={onVisibleChange}
                    >
                        <InnerButton {...buttonProps} />
                    </Popconfirm>
                ) : (
                    <InnerButton {...buttonProps} onClick={action} />
                )
            }
        />
    );
};

export default ImmortalButton;
