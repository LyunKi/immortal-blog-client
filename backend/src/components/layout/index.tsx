import { Layout, Menu, Icon, Avatar } from 'antd';
import React, { ReactChild, useCallback } from 'react';
import './index.scss';
import { useStore } from '@hooks';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Logo } from '@components';
import { generateIcons } from '@utils';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu, Item } = Menu;

interface IProps {
    children: ReactChild;
}

const ImmortalLayout = observer(({ children }: IProps) => {
    const { common } = useStore(['common']);
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
                <Menu
                    theme='dark'
                    mode='inline'
                    defaultSelectedKeys={['blog-list']}
                    defaultOpenKeys={['blog']}
                >
                    <Item key={'user'}>
                        <Link to={'/user'}>
                            <Icon type={'user'} />
                            <span>User</span>
                        </Link>
                    </Item>
                    <SubMenu
                        key={'blog'}
                        title={
                            <>
                                <Icon component={generateIcons('blog.svg')} />
                                <span>Blog Admin</span>
                            </>
                        }
                    >
                        <Item key={'blog-list'}>
                            <Link to={'/blog-list'}>
                                <Icon type='unordered-list' />
                                <span>Blog List</span>
                            </Link>
                        </Item>
                        <Item key={'create-blog'}>
                            <Link to={'/create-blog'}>
                                <Icon type='file-add' />
                                <span>Create Blog</span>
                            </Link>
                        </Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className={mainLayout}>
                <Header className={'header'}>
                    <div className={'header-right'}>
                        <Avatar className={'avatar'} icon={'user'} />
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
