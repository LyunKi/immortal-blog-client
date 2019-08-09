import { BadgeProps } from 'antd/lib/badge';
import { Badge, Icon, message, Tooltip } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { ImmortalButton } from '@components';
import './index.scss';
import { ApiAction } from '@apis';

interface IProps {
    activated: boolean;
    showAction?: {
        activeUser: number;
    };
}
const Activated = ({ activated, showAction }: IProps) => {
    const status: BadgeProps = activated
        ? { status: 'success', text: 'activated' }
        : { status: 'default', text: 'inactivated' };
    const [activating, setActivating] = useState(false);
    const show = useMemo(() => {
        return !!showAction && !activated;
    }, [showAction, activated]);
    const activate = useCallback(() => {
        if (!show || activating) {
            return;
        }
        setActivating(true);
        //@ts-ignore
        ApiAction.sendActivatedMail(showAction.activeUser)
            .then(() => {
                message.success("Active email has been sent to user's email");
            })
            .catch(setActivating.bind(null, false));
    }, [show, showAction, activating]);
    const showLoading = activating
        ? { icon: 'loading', text: 'Activating' }
        : {
              text: 'Activate now',
          };
    return (
        <div className={'activated'}>
            <Badge {...status} />
            {show && (
                <div className={'action'}>
                    <ImmortalButton
                        button={{
                            ...showLoading,
                            type: 'link',
                        }}
                        action={activate}
                        auth={{
                            requirePermissions: {
                                user: 3,
                            },
                        }}
                    />
                    <Tooltip
                        title={
                            'A mail will be sent to your register email after clicking "Activated now"'
                        }
                    >
                        <Icon type={'question-circle'} />
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default Activated;
