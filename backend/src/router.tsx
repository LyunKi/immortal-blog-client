import { Redirect, Route, RouteProps, Router, Switch } from 'react-router';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Index, Auth, Exception, TagAdmin } from '@pages';
import { history } from '@utils';
import { ImmortalLayout } from '@components';
import { useCheckStatus } from '@hooks';
import { IPermissions, IRoles } from '@interfaces';
import { DEFAULT_FORBIDDEN } from '@configs';

interface AuthProps extends RouteProps {
    requirePermissions?: IPermissions;
    requireRoles?: IRoles;
    forbiddenRoles?: IRoles;
    notFound?: boolean;
}

export const AuthRoute = observer((props: AuthProps) => {
    const {
        component: Component,
        forbiddenRoles = DEFAULT_FORBIDDEN,
        requirePermissions = {},
        requireRoles = [],
        notFound,
        ...rest
    } = props;
    const status = useCheckStatus(
        forbiddenRoles,
        requireRoles,
        requirePermissions,
        notFound,
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
                    case '404':
                        return <Redirect to={'/exception/404'} />;
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
                render={props => (
                    <ImmortalLayout {...props}>
                        <Switch>
                            <Route exact path='/tags' component={TagAdmin} />
                            <Route exact path='/index' component={Index} />
                            <Route
                                exact
                                path='/exception/:status'
                                component={Exception}
                            />
                            <Route exact path='/' component={Index} />
                            <Route notFound component={Index} />
                        </Switch>
                    </ImmortalLayout>
                )}
            />
        </Switch>
    </Router>
);

export default ImmortalRouter;
