import { Redirect, Route, RouteProps, Router, Switch } from 'react-router';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Index, Auth } from '@pages';
import { history } from '@utils';
import ImmortalLayout from '@components/layout';
import { useStore } from '@hooks';

export const AuthRoute = observer((props: RouteProps) => {
    const { component: Component, ...rest } = props;
    const { user } = useStore(['user']);
    return (
        <Route
            {...rest}
            render={props =>
                user.hasAuthorized ? (
                    // @ts-ignore
                    <Component {...props} />
                ) : (
                    <Redirect to={'/auth/login'} />
                )
            }
        />
    );
});

const ImmortalRouter = () => (
    <Router history={history}>
        <>
            <Switch>
                <Route exact path='/auth/:actionType' component={Auth} />
                <Route
                    render={() => (
                        <ImmortalLayout>
                            <Switch>
                                <AuthRoute
                                    exact
                                    path='/index'
                                    component={Index}
                                />
                                <AuthRoute component={Index} />
                            </Switch>
                        </ImmortalLayout>
                    )}
                />
            </Switch>
        </>
    </Router>
);

export default ImmortalRouter;
