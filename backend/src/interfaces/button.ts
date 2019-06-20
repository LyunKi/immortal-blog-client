import { TooltipPlacement } from 'antd/lib/tooltip';
import { IFunction, IAuthChecker } from '@interfaces';
import { ButtonType } from 'antd/lib/button';

export interface IInnerProps {
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    className?: string;
    text?: string;
    href?: string;
    tip?: {
        title?: string;
        placement?: TooltipPlacement;
    };
    onClick?: IFunction;
    type?: ButtonType;
}

export interface IButtonProps {
    auth?: IAuthChecker;
    action?: IFunction;
    button: IInnerProps;
    disabled?: boolean;
    confirm?: {
        title: string;
        className?: string;
        placement?: TooltipPlacement;
    };
}
