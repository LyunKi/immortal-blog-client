import { Avatar, Icon, Layout, Menu } from 'antd';
import React, { ReactChild, useCallback } from 'react';
import './index.scss';
import { useStore } from '@hooks';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Logo } from '@components';
import { generateIcons } from '@utils';
import { map, get } from 'lodash';
import { IObject } from '@interfaces';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu, Item } = Menu;

interface IProps {
    children: ReactChild;
}

interface IMenuIcon {
    type: 'type' | 'component';
    value: string;
}

interface IMenu {
    key: string;
    link: string;
    name: string;
    icon: IMenuIcon;
}

interface ISubMenu {
    key: string;
    name: string;
    icon: IMenuIcon;
    children: IMenu[];
}

type MultiMenu = IMenu | ISubMenu;

function isSubMenu(menu: MultiMenu): menu is ISubMenu {
    return (menu as ISubMenu).children !== undefined;
}

const MENUS: MultiMenu[] = [
    {
        key: 'user-admin',
        name: 'User Admin',
        link: '/users',
        icon: {
            type: 'type',
            value: 'team',
        },
    },
    {
        key: 'tag-admin',
        name: 'Tag Admin',
        link: '/tags',
        icon: {
            type: 'type',
            value: 'tags',
        },
    },
    {
        key: 'blog-admin',
        name: 'Blog Admin',
        icon: {
            type: 'component',
            value: 'blog',
        },
        children: [
            {
                key: 'blogs',
                name: 'Blogs',
                link: '/blogs',
                icon: {
                    type: 'type',
                    value: 'unordered-list',
                },
            },
            {
                key: 'blog-creation',
                name: 'Blog Creation',
                link: '/blogs/creation',
                icon: {
                    type: 'type',
                    value: 'file-add',
                },
            },
        ],
    },
];

const renderMenu = (menu: IMenu) => (
    <Item key={menu.key}>
        <Link to={menu.link}>
            {menu.icon.type === 'type' ? (
                <Icon type={menu.icon.value} />
            ) : (
                <Icon component={generateIcons(menu.icon.value)} />
            )}
            <span>{menu.name}</span>
        </Link>
    </Item>
);

const renderSubMenu = (menu: ISubMenu) => (
    <SubMenu
        key={menu.key}
        title={
            <>
                {menu.icon.type === 'type' ? (
                    <Icon type={menu.icon.value} />
                ) : (
                    <Icon component={generateIcons(menu.icon.value)} />
                )}
                <span>{menu.name}</span>
            </>
        }
    >
        {map(menu.children, renderMenu)}
    </SubMenu>
);

const ImmortalLayout = observer(({ children }: IProps) => {
    const { common, user } = useStore(['common', 'user']);
    let avatarProps: IObject = {
        className: 'avatar',
    };
    const avatar = get(user, 'userInfo.avatar');
    if (avatar) {
        avatarProps.src = avatar;
    } else {
        avatarProps.icon = 'user';
    }
    const onCollapse = useCallback(
        collapsed => {
            common.onCollapse(collapsed);
        },
        [common],
    );
    const mainLayout = classnames('main', common.marginMenu);
    return (
        <Layout className={'immortal-layout'}>
            <Sider
                breakpoint='lg'
                collapsible
                collapsed={common.collapsed}
                onCollapse={onCollapse}
                className={'sider'}
            >
                <Logo
                    className={classnames('menu-logo', {
                        'hide-text': common.collapsed,
                    })}
                />
                <Menu theme='dark' mode='inline'>
                    {map(MENUS, menu => {
                        return isSubMenu(menu)
                            ? renderSubMenu(menu as ISubMenu)
                            : renderMenu(menu as IMenu);
                    })}
                </Menu>
            </Sider>
            <Layout className={mainLayout}>
                <Header className={'header'}>
                    <div className={'header-right'}>
                        <Avatar {...avatarProps} />
                    </div>
                </Header>
                <Content className={'content'}>
                    <div className={'content-container'}>{children}</div>
                </Content>
                <Footer className={'footer'}>
                    Immortal blog ©2018 Created by Lynss
                </Footer>
            </Layout>
        </Layout>
    );
});

export default ImmortalLayout;
