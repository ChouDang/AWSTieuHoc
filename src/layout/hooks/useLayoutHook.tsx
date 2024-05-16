import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { CustomRouteObject } from '../routes/useRouterHook';

type MenuItem = Required<MenuProps>['items'][number];
type Breadcrumb = {
  PageName: "Trang chủ",
  path: "/",
  isParent: false
}[]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItem;
}

const useLayoutHook = (customRouter: CustomRouteObject[]) => {

  const [itemsBreadcrumb, set_itemsBreadcrumb] = useState<Breadcrumb>([])
  const [ItemsCustom, set_ItemsCustom] = useState<MenuItem[]>([])
  const [collapsed, setCollapsed] = useState(false);
  const [menu_select, set_menu_select] = useState<{
    parent_menu: string[],
    sub_menu: string[]
  }>({
    parent_menu: [],
    sub_menu: []
  })

  const actFindChirldren = (_item: CustomRouteObject) => {
    if (_item?.children?.length) {
      let result: MenuItem[] = []
      let children = _item.children || []
      children?.forEach((item) => {
        result.push(getItem(item.PageName, item.path, item.icon, actFindChirldren(item)))
      })
      return result
    } return
  }


  const actInitItems = (_customRouter: CustomRouteObject[]) => {
    let Items: MenuItem[] = []
    customRouter.forEach((item) => {
      if (item.path == "/" || item.path == "/logout") {
      } else {
        Items.push(
          getItem(item.PageName, item.path, item.icon, actFindChirldren(item))
        )
      }
    })
    return Items
  }

  const onGetBresadcrumb = () => {
    let res: any = [{
      PageName: "Trang chủ",
      path: "/",
      isParent: false
    }]

    if (window.location.pathname == "/") {
      return set_itemsBreadcrumb(res)
    }
    const actGetPathOfchildren = (_children: CustomRouteObject[]) => {
      if (_children.length) {
        _children.forEach(i => {
          if (window.location.pathname.includes(i.path) && i.path != "/") {
            res.push({
              PageName: i.PageName,
              path: i.path,
              isParent: Array.isArray(i?.children) && Boolean(i?.children?.length)
            })
            if (i.children?.length) {
              actGetPathOfchildren(i.children)
            }
          }
        })
      }
    }
    for (let i = 0; i < customRouter.length; i++) {
      if (window.location.pathname.includes(customRouter[i].path) && customRouter[i].path != "/") {
        res.push({
          PageName: customRouter[i].PageName,
          path: customRouter[i].path,
          isParent: Boolean(customRouter[i]?.children?.length)
        })
        if (customRouter[i]?.children?.length) {
          actGetPathOfchildren(customRouter[i]?.children || [])
        }
        break
      }
    }
    set_itemsBreadcrumb(res)
  }

  const onGetMenuActiveInit = () => {
    let res: any = {
      parent_menu: [],
      sub_menu: []
    }
    if (window.location.pathname == "/") {
      return set_menu_select(res)
    }
    let flatArr: CustomRouteObject[] = []
    const actGetFlatArr = (route: any) => {
      let routeCheck = Array.isArray(route) ? route : [route]
      flatArr = [...flatArr, ...routeCheck]
      if (route.children?.length) {
        actGetFlatArr(route.children)
      }
    }
    const actFindParentMenu = (_parentId = "") => {
      if (_parentId) {
        let parent = flatArr.find(i => i.Id == _parentId)
        if (parent) {
          res = { ...res, parent_menu: [...res.parent_menu, parent.path] }
          if (parent.parentId) {
            actFindParentMenu(parent.parentId)
          }
        }
      }
    }
    customRouter.forEach(i => {
      actGetFlatArr(i)
    })
    let curSelect = flatArr.find(i => i.path == window.location.pathname)
    if (curSelect) {
      res = { ...res, sub_menu: [curSelect.path] }
      if (curSelect.parentId) {
        actFindParentMenu(curSelect.parentId)
      }
    }
    set_menu_select(res)
  }

  useEffect(() => {
    onGetMenuActiveInit()
    if (customRouter?.length) {
      set_ItemsCustom(actInitItems(customRouter))
    }
  }, [])

  useEffect(() => {
    onGetBresadcrumb()
  }, [window.location.pathname])

  return {
    collapsed,
    setCollapsed,
    itemsBreadcrumb,
    items: ItemsCustom,
    menu_select,
    set_menu_select,
  }
}

export default useLayoutHook