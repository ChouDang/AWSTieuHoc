import { Fragment, useEffect, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { nanoid } from '@reduxjs/toolkit';
import { Button, notification } from 'antd';
import { list, remove, uploadData } from 'aws-amplify/storage';
import { useAppSelector } from '../../../../redux/hook';

const Avatar = () => {

    const UserInfo = useAppSelector(state => state.user.UserInfo)

    const [file, setFile] = useState<any>(null)
    const [fetch, set_fetch] = useState(false)

    const handleChange = async (event: any) => {
        try {
            let el: Element & { click: VoidFunction } | null = document.querySelector(".trigger-avatar")
            if (file?.path) {
                await remove({
                    path: `${file?.path}`,
                }).finally(async () => {
                    await uploadData({
                        path: `profile-pictures/${UserInfo?.identityId}/avatar-user`,
                        data: event.target.files[0] as File,
                    }).result
                    setTimeout(() => {
                        set_fetch(bol => !bol)
                        el && el.click()
                        notification.success({
                            message: "Thao tác thành công",
                            duration: 3
                        })
                    }, 200)
                }).catch((err: any) => {
                    console.log(err, "err")
                })
            } else {
                await uploadData({
                    path: `profile-pictures/${UserInfo?.identityId}/avatar-user`,
                    data: event.target.files[0] as File,
                }).result
                set_fetch(bol => !bol)
                el && el.click()
                notification.success({
                    message: "Thao tác thành công",
                    duration: 3
                })
            }
        } catch (error) {
            console.log(error, "error")
            notification.error({
                message: "Lỗi server",
                duration: 3
            })
        }
    };

    const handleDelete = () => {
        try {
            let el: Element & { click: VoidFunction } | null = document.querySelector(".trigger-avatar")
            remove({
                path: `${file?.path}`,
            }).finally(() => {
                set_fetch(bol => !bol)
                el && el.click()
                notification.success({
                    message: "Thao tác thành công",
                    duration: 3
                })
            })
        } catch (error) {
            console.log(error, "err")
            notification.error({
                message: "Lỗi server",
                duration: 3
            })
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const result = await list({
                    path: ({ identityId }) => {
                        return `profile-pictures/${identityId}/`
                    }
                });
                setFile(result?.items?.[0] || null)
            } catch (error) {
                console.log(error);
            }
        })()
    }, [fetch])

    const uploadButton = (
        <Button shape={"circle"} style={{
            minHeight: 150,
            minWidth: 150,
            outline: "unset"
        }} onClick={() => {
            let el: Element & { click: VoidFunction } | null = document.querySelector("#upload-avatar")
            el && el.click()
        }}>
            <PlusOutlined width={100} height={100} />
        </Button>
    );

    return (
        <Fragment>
            <input
                accept='image/*'
                key={nanoid()} className='d-none' type="file" id="upload-avatar" onChange={handleChange} />
            {!file && uploadButton}
            {file ?
                <Button
                    onClick={() => {
                        let el: Element & { click: VoidFunction } | null = document.querySelector("#upload-avatar")
                        el && el.click()
                    }}
                    type={"text"}
                    shape={"circle"}
                    style={{
                        height: "fit-content",
                        width: 'fit-content',
                        padding: 0,
                        outline: "unset"
                    }}
                >
                    <div style={{
                        position: "relative"
                    }}>
                        <StorageImage
                            alt="cat"
                            path={({ identityId }) => {
                                return `profile-pictures/${identityId}/avatar-user`
                              }}
                            style={{
                                borderRadius: '50%',
                                width: 150,
                                height: 150,
                            }}
                        />
                        <Button shape={"circle"} style={{
                            position: "absolute",
                            top: 0,
                            right: 0
                        }}
                            onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleDelete()
                            }}
                        >
                            <DeleteOutlined color='red' size={20} />
                        </Button>
                    </div>
                </Button>
                : <></>
            }
        </Fragment>
    )
}

export default Avatar