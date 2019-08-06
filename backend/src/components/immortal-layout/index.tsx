import {
    Avatar,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Dropdown,
    Icon,
    Layout,
    List,
    Menu,
} from 'antd';
import React, { ReactChild, useCallback, useEffect, useMemo } from 'react';
import './index.scss';
import { useStore } from '@hooks';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Logo } from '@components';
import { generateIcons, stopPropagation } from '@utils';
import { filter, get, map } from 'lodash';
import { IFunction, IMessage, IObject } from '@interfaces';
import moment from 'moment';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu, Item } = Menu;
const ListItem = List.Item;
const ListItemMeta = List.Item.Meta;

interface IProps {
    children: ReactChild;
    location: IObject;
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

const LoadMore = observer(() => {
    const { common } = useStore(['common']);
    const loadMore = useCallback(common.loadMore.bind(common), [common]);
    return (
        <Button onClick={loadMore} disabled={!common.canLoadMore} type={'link'}>
            Load More
        </Button>
    );
});

const ClearAll = observer(() => {
    const { common } = useStore(['common']);
    const clearAll = useCallback(common.clearAll.bind(common), [common]);
    return (
        <Button onClick={clearAll} disabled={!common.canClearAll} type={'link'}>
            Clear All
        </Button>
    );
});

const MessageItem = ({ item }: { item: IMessage }) => {
    const avatar = item.img && <Avatar src={item.img} />;
    const title = item.href ? (
        <Link to={item.href}>{item.title}</Link>
    ) : (
        item.title
    );
    const fromNow = moment(item.createAt).fromNow();
    return (
        <ListItem className={'message'}>
            <ListItemMeta
                avatar={avatar}
                title={title}
                description={
                    <div className={'description'}>
                        <div className={'content'}>{item.content}</div>
                        <div className={'from-now'}>{fromNow}</div>
                    </div>
                }
            />
        </ListItem>
    );
};

interface IBellMenuProps {
    notifications: IMessage[];
    messages: IMessage[];
}

const BellMenu = observer(({ notifications, messages }: IBellMenuProps) => {
    const tabListNoTitle = [
        {
            key: 'notifications',
            tab: `Notifications(${notifications.length})`,
        },
        {
            key: 'messages',
            tab: `Messages(${messages.length})`,
        },
    ];
    const { common } = useStore(['common']);
    return (
        <div onClick={stopPropagation}>
            <Card
                className={'notification-card'}
                onClick={stopPropagation}
                size={'small'}
                activeTabKey={common.showMessageKey}
                onTabChange={common.onMessageKeyChange.bind(common)}
                tabList={tabListNoTitle}
                actions={[<LoadMore />, <ClearAll />]}
            >
                {
                    <List
                        className='message-list'
                        itemLayout='horizontal'
                        loadMore={true}
                        dataSource={common.datasource}
                        renderItem={item => <MessageItem item={item} />}
                    />
                }
            </Card>
        </div>
    );
});

interface IRightMenuProps {
    logout: IFunction;
}

const RightMenu = ({ logout }: IRightMenuProps) => {
    return (
        <Menu className={'user-action'}>
            <Menu.Item key='0'>
                <Link to={'/user-center'}>
                    <Icon type={'user'} /> User Center
                </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key='1'>
                <span onClick={logout}>
                    <Icon type={'logout'} /> Logout
                </span>
            </Menu.Item>
        </Menu>
    );
};

const ImmortalLayout = observer(({ children, location }: IProps) => {
    //Create breadcrumb
    const pathSnippets = filter(location.pathname.split('/'), (i: any) => i);
    const extraBreadcrumbItems = map(
        pathSnippets,
        (value: any, index: number) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>{value}</Link>
                </Breadcrumb.Item>
            );
        },
    );
    const breadcrumbItems = [
        <Breadcrumb.Item key='home'>
            <Link to='/'>
                <Icon type={'home'} />
            </Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    const { common, user } = useStore(['common', 'user']);
    //Create websocket with server
    useEffect(() => {
        common.initConnection();
        return common.disconnect.bind(common);
    }, [common]);
    const { collapsed, messages, notifications } = common;
    const nickname = get(user, 'userInfo.nickname');
    const menus: MultiMenu[] = useMemo(() => {
        return [
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
                key: 'category-admin',
                name: 'Category Admin',
                link: '/categories',
                icon: {
                    type: 'component',
                    value: 'category',
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
                        link: '/blog-creation',
                        icon: {
                            type: 'type',
                            value: 'file-add',
                        },
                    },
                ],
            },
            {
                key: 'user-center',
                name: 'User Center',
                link: `/user-center`,
                icon: {
                    type: 'type',
                    value: 'user',
                },
            },
        ];
    }, []);
    const avatar = get(user, 'userInfo.avatar');
    const avatarProps = avatar
        ? {
              src: avatar,
              alt: nickname,
              className: 'avatar img',
          }
        : {
              icon: 'user',
              className: 'avatar string',
          };
    const onCollapse = useCallback(
        collapsed => {
            common.onCollapse(collapsed);
        },
        [common],
    );
    const mainLayout = classnames('main', common.marginMenu);
    const logout = useCallback(
        event => {
            user.logout(event);
        },
        [user],
    );
    return (
        <Layout className={'immortal-layout'}>
            <Sider
                breakpoint='lg'
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                className={'sider'}
            >
                <Logo
                    className={classnames('menu-logo', {
                        'hide-text': collapsed,
                    })}
                />
                <Menu theme='dark' mode='inline'>
                    {map(menus, menu => {
                        return isSubMenu(menu)
                            ? renderSubMenu(menu as ISubMenu)
                            : renderMenu(menu as IMenu);
                    })}
                </Menu>
            </Sider>
            <Layout className={mainLayout}>
                <Header className={'header'}>
                    <div className={'header-left'}>
                        <Breadcrumb>{breadcrumbItems}</Breadcrumb>
                    </div>
                    <div className={'header-right'}>
                        {
                            <Dropdown
                                overlay={
                                    <BellMenu
                                        messages={messages}
                                        notifications={notifications}
                                    />
                                }
                                trigger={['click']}
                            >
                                <div className={'operation'}>
                                    <Badge count={common.totalNum}>
                                        <Icon
                                            type={'bell'}
                                            className={'notification'}
                                        />
                                    </Badge>
                                </div>
                            </Dropdown>
                        }
                        <Dropdown overlay={<RightMenu logout={logout} />}>
                            <div className={'operation'}>
                                <Avatar {...avatarProps} />
                                <span className={'nickname'}>{nickname}</span>
                            </div>
                        </Dropdown>
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
