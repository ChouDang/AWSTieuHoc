import { useEffect } from 'react';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Divider, Dropdown, Layout as LayoutAntd, Menu, Row, Select, Space, Typography, theme } from 'antd';
import { AuthUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { RouterProvider, } from "react-router-dom";
import { Fragment } from 'react/jsx-runtime';
import type { Schema } from '../../amplify/data/resource';
import { handleSchoolYearHubThunk, updateLstSchoolYear, updateSchoolYearSelect } from '../redux/SchoolYear/SchoolYearSilice';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { ListSchoolYear } from '../services/SchoolYear';
import useLayoutHook from './hooks/useLayoutHook';
import useRouterHook from './routes/useRouterHook';

const { Header, Content, Sider } = LayoutAntd;

type Props = {
  signOut: any,
  user: AuthUser | undefined
}
const client = generateClient<Schema>();

const ChooseYearSchool = () => {

  const dispatch = useAppDispatch()
  const LstSchoolYear = useAppSelector(state => state.schoolyear.LstSchoolYear)
  const SchoolYearSelect = useAppSelector(state => state.schoolyear.SchoolYearSelect)

  const onInit = async () => {
    let { data } = await ListSchoolYear()
    let optSchoolYear = data.map(i => ({
      ...i,
      value: i.id,
      label: i.YearName,
    }))
    dispatch(updateLstSchoolYear(optSchoolYear))
    let objActive = optSchoolYear.find(i => i.Status == "Active")
    objActive && dispatch(updateSchoolYearSelect(objActive.id))
  }

  useEffect(() => { onInit() }, [])
  useEffect(() => {
    // Subscribe to creation of.SchoolYear
    const createSub = client.models.SchoolYear.onCreate().subscribe({
      next: async (data) => await dispatch(handleSchoolYearHubThunk({ ...data, type: "create" })),
      error: (error) => console.warn(error),
    });
    // Subscribe to update of.SchoolYear
    const updateSub = client.models.SchoolYear.onUpdate().subscribe({
      next: async (data) => await dispatch(handleSchoolYearHubThunk({ ...data, type: "update" })),
      error: (error) => console.warn(error),
    });
    // Subscribe to deletion of.SchoolYear
    const deleteSub = client.models.SchoolYear.onDelete().subscribe({
      next: async (data) => await dispatch(handleSchoolYearHubThunk({ ...data, type: "delete" })),
      error: (error) => console.warn(error),
    });
    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    }
  }, [])

  return <Fragment>
    <Select
      style={{minWidth: 200}}
      value={SchoolYearSelect}
      options={LstSchoolYear}
      onChange={(e) => dispatch(updateSchoolYearSelect(e))}
    />
  </Fragment>
}

const Layout = (props: Props) => {

  const { router, customRouter, userInfo } = useRouterHook(props)
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
      <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="Logo" style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 20
        }} onClick={() => {
          router.navigate("/")
          set_menu_select(_menu_select => {
            _menu_select.sub_menu = []
            return { ..._menu_select }
          })
        }}>
          <img src={process.env.NODE_ENV == "development"
            ? `${window.location.origin}/public/LOGOCHOUDANG.png`
            : `${window.location.origin}/LOGOCHOUDANG.png`
          } alt="logo" width={180} height={100} />
        </div>
        <Menu theme="dark" mode="inline"
          items={items}
          onClick={e => {
            router.navigate(e.keyPath[0])
            set_menu_select(_menu_select => ({ ..._menu_select, sub_menu: [e.keyPath[0]] }))
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
        <Header style={{ background: colorBgContainer }} >
          <Row justify={"space-between"} align={"middle"} >
            <Col>
            </Col>
            <Col>
              <Typography.Title level={4}>{userInfo?.SchoolName || ""}</Typography.Title>
            </Col>
            <Col>
              <Space>
                <Dropdown
                  menu={{
                    items: [],
                  }}
                  trigger={['click']}
                >
                  <Button size={"large"} shape='circle' icon={<BellOutlined size={20} />} />
                </Dropdown>
                <Divider type={"vertical"} />
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: '1',
                        label: "Thông tin cá nhân",
                        onClick: () => {
                          router.navigate("/UserInfo")
                          set_menu_select(_menu_select => ({ ..._menu_select, sub_menu: [] }))
                        }
                      },
                      {
                        key: '2',
                        label: "Đăng xuất",
                        onClick: () => props?.signOut()
                      },
                    ],
                  }}
                  trigger={['click']}
                >
                  <Avatar className='mb-2' size={40} icon={<UserOutlined />} />
                </Dropdown>
              </Space>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '8px 16px' }}>
          <Row justify={"space-between"} align={"middle"}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {itemsBreadcrumb?.length && itemsBreadcrumb.map((item, index) => <Breadcrumb.Item
                onClick={() => {
                  if (!item.children?.length) {
                    router.navigate(item.path)
                    set_menu_select(_menu_select => ({ ..._menu_select, sub_menu: [item.path] }))
                  }
                }} key={index}>
                {item?.PageName}
              </Breadcrumb.Item>)}
            </Breadcrumb>
            <ChooseYearSchool />
          </Row>
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