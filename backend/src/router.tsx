import { Redirect, Route, RouteProps, Router, Switch } from 'react-router';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Index, Auth } from '@pages';
import { history } from '@utils';
import { ImmortalLayout } from '@components';
import { useAuthentication } from '@hooks';
import { IPermissions, IRoles } from '@interfaces';
import { DEFAULT_FORBIDDEN } from '@configs';

interface AuthProps extends RouteProps {
    requirePermissions?: IPermissions;
    requireRoles?: IRoles;
    forbiddenRoles?: IRoles;
}

export const AuthRoute = observer((props: AuthProps) => {
    const {
        component: Component,
        forbiddenRoles = DEFAULT_FORBIDDEN,
        requirePermissions = {},
        requireRoles = [],
        ...rest
    } = props;
    const status = useAuthentication(
        forbiddenRoles,
        requireRoles,
        requirePermissions,
    );
    return (
        <Route
            {...rest}
            render={props => {
                switch (status) {
                    case '200':
                        // @ts-ignore
                        return <Component {...props} />;
                    case '401':
                        return <Redirect to={'/auth/login'} />;
                    case '403':
                        return <Redirect to={'/exception/403'} />;
                }
            }}
        />
    );
});

const ImmortalRouter = () => (
    <Router history={history}>
        <Switch>
            <Route exact path='/auth/:actionType' component={Auth} />
            <Route
                render={() => (
                    <ImmortalLayout>
                        <Switch>
                            <AuthRoute exact path='/index' component={Index} />
                            <AuthRoute component={Index} />
                        </Switch>
                    </ImmortalLayout>
                )}
            />
        </Switch>
    </Router>
);

export default ImmortalRouter;
