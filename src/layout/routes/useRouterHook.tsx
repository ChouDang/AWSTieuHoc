import { AuthUser } from 'aws-amplify/auth';
import React, { useEffect } from 'react';
import { Outlet, RouteObject, createBrowserRouter } from 'react-router-dom';
import Error from '../../pages/Error';
import Home from '../../pages/Home';
import SchoolYear from '../../pages/SchoolYear';
import UserInfo from '../../pages/UserInfo';
import { updateUserInfoLogin } from '../../redux/User/UserSilice';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchAuthSession } from 'aws-amplify/auth';
import Class from '../../pages/Class';

type PropsCustom = {
    signOut: () => Promise<void>,
    user: AuthUser | undefined,
}

export type CustomRouteObject = Omit<RouteObject, "children"> & {
    Id: string,
    parentId?: string,
    PageName?: string,
    roleName?: string,
    label?: string,
    permission?: {},
    icon?: React.ReactNode,
    children?: CustomRouteObject[],
    path: string,
    isShowMenu: boolean,
};

const useRouterHook = (props: PropsCustom) => {

    const {
        signOut,
        user
    } = props

    const userInfo = useAppSelector(state => state.user.UserInfo)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user) {
            fetchAuthSession().then((info) => {
                dispatch(updateUserInfoLogin({
                    ...user,
                    SchoolName: "ChouDang School",
                    SchoolLevel: 1,
                    Region: "ap-southeast-1",
                    identityId: info.identityId || ""
                }))
            });
        }
    }, [user])

    const customRouter: CustomRouteObject[] = [
        {
            path: "/",
            Id: 'Root',
            parentId: "",
            roleName: "",
            PageName: "Trang chủ",
            permission: { View: true, Edit: true },
            element: <>Trang Chủ</>,
            errorElement: <Error />,
            isShowMenu: false,
        },
        {
            path: "/UserInfo",
            Id: 'UserInfo',
            parentId: "",
            roleName: "",
            PageName: "Thông tin cá nhân",
            permission: { View: true, Edit: true },
            element: <UserInfo />,
            isShowMenu: false,
        },

        {
            path: "/Home",
            Id: 'Home',
            parentId: "",
            roleName: "",
            PageName: "Dashboard",
            permission: { View: true, Edit: true },
            element: <Home />,
            errorElement: <Error />,
            isShowMenu: true,
        },
        {
            path: "/SchoolInfomation",
            Id: 'SchoolInfo',
            roleName: "",
            parentId: "",
            PageName: "Thông tin trường",
            element: <Outlet />,
            isShowMenu: true,
            children: [
                {
                    index: true,
                    path: "/SchoolInfomation/Year",
                    Id: "SchoolYear-Year",
                    parentId: "SchoolInfo",
                    roleName: "",
                    PageName: "Năm học",
                    permission: { View: true, Edit: true },
                    element: <SchoolYear />,
                    errorElement: <Error />,
                    isShowMenu: true,
                },
                {
                    path: "/SchoolInfomation/Class",
                    Id: "SchoolYear-Class",
                    parentId: "SchoolInfo",
                    roleName: "",
                    PageName: "Lớp học",
                    permission: { View: true, Edit: true },
                    element: <Class />,
                    errorElement: <Error />,
                    isShowMenu: true,
                },
            ],
        },

        {
            path: "/logout",
            Id: 'logout',
            parentId: "",
            isShowMenu: false,
            async action() {
                signOut()
            },
        },
    ]

    const router = createBrowserRouter(customRouter as RouteObject[]);

    if (import.meta.hot) {
        import.meta.hot.dispose(() => router.dispose());
    }

    return { router, customRouter, userInfo }
}

export default useRouterHook