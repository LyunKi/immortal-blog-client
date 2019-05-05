import { Redirect, Route, RouteProps, Switch } from 'react-router';
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Context from '@context';
import { Index, Login } from '@pages';
import { BrowserRouter } from 'react-router-dom';

export const AuthRoute = observer((props: RouteProps) => {
    const { component: Component, ...rest } = props;
    const { user } = useContext(Context);
    return (
        <Route
            {...rest}
            render={props =>
                user.hasAuthorized ? (
                    // @ts-ignore
                    <Component {...props} />
                ) : (
                    <Redirect to={'/login'} />
                )
            }
        />
    );
});

export const LoginRoute = observer((props: RouteProps) => {
    const { user } = useContext(Context);
    return (
        <Route
            {...props}
            render={props =>
                user.hasAuthorized ? <Redirect to={'/index'} /> : <Login />
            }
        />
    );
});

const ImmortalRouter = () => (
    <BrowserRouter>
        <>
            <Switch>
                <LoginRoute exact path='/login' />
                <Route exact path='/index' component={Index} />
                <AuthRoute exact path='/' component={Index} />
            </Switch>
        </>
    </BrowserRouter>
);

export default ImmortalRouter;
