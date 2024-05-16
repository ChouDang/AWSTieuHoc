import React, { useEffect } from 'react';
import { AuthUser } from 'aws-amplify/auth';
import { Outlet, RouteObject, createBrowserRouter } from 'react-router-dom';
import Error from '../../pages/Error';
import Home from '../../pages/Home';
import SchoolYear from '../../pages/SchoolYear';
import { updateUserInfoLogin } from '../../redux/User/UserSilice';
import { useAppDispatch } from '../../redux/hook';

type PropsCustom = {
    signOut:  () => Promise<void>,
    user: AuthUser | undefined,
}

export type CustomRouteObject = Omit<RouteObject, "children"> & {
    Id:string,
    parentId?: string,
    PageName?: string,
    roleName?: string,
    label?: string,
    permission?: {},
    icon?: React.ReactNode,
    children?: CustomRouteObject[],
    path: string,
  };

const useRouterHook = (props: PropsCustom) => {

    const {
        signOut,
        user
    } = props

    const dispatch = useAppDispatch()
   
    useEffect(()=>{
        if(user){
            dispatch(updateUserInfoLogin({...user, 
                SchoolName: "ChouDang School",
                SchoolLevel: 1,
            }))
        }
    },[user])

    const customRouter : CustomRouteObject[] = [
        {
            path: "/",
            Id: 'Root',
            parentId: "",
            roleName: "",
            PageName: "Trang chủ",
            permission: { View: true, Edit: true },
            element: <>Trang Chủ</>,
            errorElement: <Error />,
        },
        {
            path: "/Home",
            Id: 'Home',
            parentId: "",
            roleName: "",
            PageName: "Dashboard",
            permission: { View: true, Edit: true },
            element: <Home/>,
            errorElement: <Error />,
        },
        {
            path: "/SchoolInfomation",
            Id: 'SchoolInfo',
            roleName: "",
            parentId: "",
            PageName: "Thông tin trường",
            element: <Outlet/>,
            children: [
                {
                    index: true,
                    path: "/SchoolInfomation/Year",
                    Id: "SchoolYear-Year",
                    parentId: "SchoolInfo",
                    roleName: "",
                    PageName: "Năm học",
                    permission: { View: true, Edit: true },
                    element: <SchoolYear/>,
                    errorElement: <Error />,
                },
            ],
        },
        
        {
            path: "/logout",
            Id: 'logout',
            parentId: "",
            async action() {
                signOut()
            },
        },
    ]

    const router = createBrowserRouter(customRouter as RouteObject[]);

    if (import.meta.hot) {
        import.meta.hot.dispose(() => router.dispose());
    }

    return { router, customRouter }
}

export default useRouterHook