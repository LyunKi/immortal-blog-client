import { Layout, Menu, Icon } from 'antd';
import React, { ReactChild, useCallback } from 'react';
import './index.scss';
import { useStore } from '@hooks';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface IProps {
    children: ReactChild;
}

const ImmortalLayout = observer(({ children }: IProps) => {
    const { common } = useStore(['common']);
    const onCollapse = useCallback(
        collapsed => {
            console.warn(collapsed);
            common.onCollapse(collapsed);
        },
        [common],
    );
    return (
        <Layout className={'immortal-layout'}>
            <Sider
                breakpoint='lg'
                collapsible
                collapsed={common.collapsed}
                onCollapse={onCollapse}
                className={'sider'}
            >
                <div className='logo' />
                <Menu
                    theme='dark'
                    mode='inline'
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                >
                    <SubMenu
                        key='sub1'
                        title={
                            <>
                                <Icon type='user' />
                                <span> subnav 1</span>
                            </>
                        }
                    >
                        <Menu.Item key='1'>
                            <Icon type='user' />
                            <span className='nav-text'>nav 1</span>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <Link to={'/login'}>
                                <Icon type='video-camera' />
                                <span className='nav-text'>nav 2</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className={'main'}>
                <Header className={'header'} />
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
