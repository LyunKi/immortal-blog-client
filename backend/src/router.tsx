import { Redirect, Route, RouteProps, Router, Switch } from 'react-router';
import React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Auth,
    Exception,
    Index,
    TagAdmin,
    CategoryAdmin,
    UserAdmin,
    BlogList,
    BlogCreation,
    UserSettings,
} from '@pages';
import { get } from 'lodash';
import { history } from '@utils';
import { ImmortalLayout } from '@components';
import { useCheckStatus } from '@hooks';
import { IAuthChecker } from '@interfaces';
import { DEFAULT_FORBIDDEN } from '@configs';

type AuthProps = RouteProps &
    IAuthChecker & {
        dynamicRequireSelf?: boolean;
    };
export const AuthRoute = observer((props: AuthProps) => {
    const {
        component: Component,
        forbiddenRoles = DEFAULT_FORBIDDEN,
        requirePermissions = {},
        requireRoles = [],
        notFound,
        dynamicRequireSelf = false,
        ...rest
    } = props;
    const computedMatch = get(rest, 'computedMatch');
    let requireUser: string | false = false;
    if (dynamicRequireSelf && get(computedMatch, 'params.username')) {
        requireUser = computedMatch.params.userId;
    }
    const status = useCheckStatus({
        forbiddenRoles,
        requireRoles,
        requirePermissions,
        notFound,
        requireUser,
    });
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
                            <AuthRoute
                                requirePermissions={{ tag: 2 }}
                                exact
                                path='/tags'
                                component={TagAdmin}
                            />
                            <AuthRoute
                                requirePermissions={{ blog: 2 }}
                                exact
                                path='/blogs'
                                component={BlogList}
                            />
                            <AuthRoute
                                requirePermissions={{ category: 2 }}
                                exact
                                path='/categories'
                                component={CategoryAdmin}
                            />
                            <AuthRoute
                                requirePermissions={{ blog: 3 }}
                                exact
                                path='/blog-creation'
                                component={BlogCreation}
                            />
                            <AuthRoute
                                requireRoles={['immortal']}
                                exact
                                path='/users'
                                component={UserAdmin}
                            />
                            <AuthRoute
                                forbiddenRoles={[]}
                                exact
                                path='/users/:nickname'
                                dynamicRequireSelf
                                component={UserSettings}
                            />
                            <AuthRoute
                                forbiddenRoles={[]}
                                exact
                                path='/user-center'
                                dynamicRequireSelf
                                component={UserSettings}
                            />
                            <AuthRoute exact path='/index' component={Index} />
                            <AuthRoute
                                exact
                                forbiddenRoles={[]}
                                path='/exception/:status'
                                component={Exception}
                            />
                            <AuthRoute exact path='/' component={Index} />
                            <AuthRoute notFound component={Index} />
                        </Switch>
                    </ImmortalLayout>
                )}
            />
        </Switch>
    </Router>
);

export default ImmortalRouter;
