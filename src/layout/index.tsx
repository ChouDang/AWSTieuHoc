import { Breadcrumb, Layout as LayoutAntd, Menu, theme } from 'antd';
import { AuthUser } from 'aws-amplify/auth';
import { RouterProvider, } from "react-router-dom";
import useLayoutHook from './hooks/useLayoutHook';
import useRouterHook from './routes/useRouterHook';

const { Header, Content, Sider } = LayoutAntd;

type Props = {
  signOut: any,
  user: AuthUser | undefined
}

const Layout = (props: Props) => {

  const { router, customRouter } = useRouterHook(props)
  const { 
    collapsed, 
    setCollapsed,
    itemsBreadcrumb, 
    items, 
    menu_select,
    set_menu_select,
  } = useLayoutHook(customRouter)
 
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <LayoutAntd style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="Logo" style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 20
        }} onClick={() =>{
          router.navigate("/") 
          set_menu_select(_menu_select => {
            _menu_select.sub_menu = []
            return { ..._menu_select }
          })
        }}>
          <img src={`${window.location.origin}/public/LOGOCHOUDANG.png`} alt="logo" width={180} height={100} />
        </div>
        <Menu theme="dark" mode="inline"
          items={items}
          onClick={e => {
            router.navigate(e.keyPath[0])
            set_menu_select(_menu_select => ({..._menu_select, sub_menu: [e.keyPath[0]]}))
          }}
          inlineCollapsed={collapsed}
          onOpenChange={arr_key => {
            !collapsed && set_menu_select(_menu_select => {
              _menu_select.parent_menu = [...arr_key]
              return { ..._menu_select }
            })
          }}
          selectedKeys={menu_select?.sub_menu}
          defaultOpenKeys={!collapsed ? menu_select.parent_menu : undefined}
          openKeys={(!collapsed) ? menu_select.parent_menu : undefined}
        />
      </Sider>
      <LayoutAntd>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '8px 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {itemsBreadcrumb?.length && itemsBreadcrumb.map((item, index) => <Breadcrumb.Item
              onClick={()=> {
                if(!item.isParent){
                  router.navigate(item?.path)
                }
              }} key={index}>
              {item?.PageName}
            </Breadcrumb.Item>)}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh -150px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
          </div>
        </Content>
      </LayoutAntd>
    </LayoutAntd>
  );
}

export default Layout