import React, { Fragment, useEffect, useState } from 'react'
import { Button, Col, Descriptions, Input, Modal, Row, notification } from 'antd';
import { AuthUserCustom } from '../../../../redux/User/UserSilice';
import { Controller, useForm } from 'react-hook-form';
import { confirmResetPassword, updatePassword } from 'aws-amplify/auth';
import { resetPassword } from 'aws-amplify/auth';
import { useAppSelector } from '../../../../redux/hook';
import { nanoid } from '@reduxjs/toolkit';

type PropsPass = {
    UserInfo: AuthUserCustom | undefined,
    open: boolean,
    set_open: React.Dispatch<React.SetStateAction<boolean>>
}

type UserInfoPass = {
    OldPass: string,
    NewPass: string,
    NewPassCheck: string,
}

const ModalChangePass = (props: PropsPass) => {
    const {
        UserInfo,
        open = false,
        set_open = () => { }
    } = props

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, errors }
    } = useForm<UserInfoPass>()

    const onSubmit = async (data: UserInfoPass) => {
        if (data.NewPass == data.NewPassCheck) {
            await updatePassword({
                oldPassword: data.OldPass,
                newPassword: data.NewPass,
            }).then(() => {
                notification.success({
                    message: "Thao tác thành công",
                    duration: 3,
                })
                set_open(false)
            }).catch((err: any) => {
                console.log(err, "err")
            })
        } else {
            notification.error({
                message: "Hiện mật khẩu mới xác nhận không giống nhau",
                duration: 3,
            })
        }
    }

    const onResetPass = async () => {
        // await confirmResetPassword({
        //     username: UserInfo?.signInDetails?.loginId || "",
        //     confirmationCode: nanoid(),
        //     newPassword: nanoid(),
        //   });
    }

    // useEffect(() => {
    //     (async () => {
    //         if (UserInfo?.signInDetails?.loginId) {
    //             const output = await resetPassword({
    //                 username: UserInfo?.signInDetails?.loginId
    //             });
    //             const { nextStep } = output;
    //             switch (nextStep.resetPasswordStep) {
    //                 case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
    //                     const codeDeliveryDetails = nextStep.codeDeliveryDetails;
    //                     console.log(
    //                         `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
    //                     );
    //                     // Collect the confirmation code from the user and pass to confirmResetPassword.
    //                     break;
    //                 case 'DONE':
    //                     console.log('Successfully reset password.');
    //                     break;
    //             }
    //         }
    //     })()
    // }, [UserInfo])

    useEffect(() => {
        reset()
    }, [open])

    return (<Fragment>
        <Modal
            title={`Thay đổi mật khẩu`}
            centered
            open={open}
            okText={"Xác nhận"}
            cancelText={"Hủy"}
            onOk={() => {
                handleSubmit(onSubmit)()
            }}
            okButtonProps={{
                disabled: !isDirty
            }}
            onCancel={() => set_open(false)}
            footer={[
                <Button key="back" onClick={() => onResetPass()}>
                    Làm mới PassWord
                </Button>,
                <Button key="submit" type="primary" onClick={() => set_open(false)}>
                    Hủy
                </Button>,
                <Button
                    type="primary"
                    disabled={!isDirty}
                    onClick={handleSubmit(onSubmit)}
                >
                    Xác nhận
                </Button>,
            ]}
        >
            <Row>
                <Col span={24}>
                    <Controller
                        name={"OldPass"}
                        control={control}
                        rules={{
                            required: true
                        }}
                        render={({ field: { onChange, onBlur, value, ref } }) => {
                            return <Row>
                                <div><span>Mật khẩu cũ</span></div>
                                <Input
                                    type='password'
                                    className='w-100'
                                    placeholder='Nhập mật khẩu cũ'
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value as string}
                                    ref={ref}
                                />
                                {errors?.OldPass && <span style={{ color: "red", fontSize: 13 }} >Không được để trống</span>}
                            </Row>
                        }}
                    />
                </Col>
                <Col span={24}>
                    <Controller
                        name={"NewPass"}
                        control={control}
                        rules={{
                            required: true
                        }}
                        render={({ field: { onChange, onBlur, value, ref } }) => {
                            return <Row>
                                <div><span>Mật khẩu mới</span></div>
                                <Input
                                    type='password'
                                    className='w-100'
                                    placeholder='Nhập mật khẩu mới'
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value as string}
                                    ref={ref}
                                />
                                {errors?.NewPass && <span style={{ color: "red", fontSize: 13 }} >Không được để trống</span>}
                            </Row>
                        }}
                    />
                </Col>
                <Col span={24}>
                    <Controller
                        name={"NewPassCheck"}
                        control={control}
                        rules={{
                            required: true
                        }}
                        render={({ field: { onChange, onBlur, value, ref } }) => {
                            return <Row>
                                <div><span>Nhập lại mật khẩu mới</span></div>
                                <Input
                                    type='password'
                                    className='w-100'
                                    placeholder='Nhập mật khẩu mới'
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value as string}
                                    ref={ref}
                                />
                                {errors?.NewPass && <span style={{ color: "red", fontSize: 13 }} >Không được để trống</span>}
                            </Row>
                        }}
                    />
                </Col>
            </Row>
        </Modal>
    </Fragment>)

}

const UserDetail = () => {

    const UserInfo = useAppSelector(state => state.user.UserInfo)
    const [open, set_open] = useState(false)

    return (
        <Fragment>
            <Descriptions title="Thông tin cá nhân" column={2} items={[
                {
                    key: '1',
                    label: 'Tài khoản',
                    children: UserInfo?.signInDetails?.loginId,
                },
                {
                    key: '2',
                    label: 'Mật khẩu',
                    children: <Fragment>
                        <Button size={"small"} onClick={() => set_open(true)}>
                            Đổi mật khẩu mới
                        </Button>
                    </Fragment>,
                },
            ]} />
            <ModalChangePass
                UserInfo={UserInfo}
                open={open}
                set_open={set_open}
            />
        </Fragment>
    )
}

export default UserDetail