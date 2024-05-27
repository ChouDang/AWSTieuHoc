import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { ClassUpdate } from '../../../consts/types'
import { Button, Empty, Modal, Row, Space, Table, TableProps, notification } from 'antd'
import { DeleteClasses, ListClassesInTrash, RestoreTrashToClasses } from '../../../services/Class'
import { useAppSelector } from '../../../redux/hook'

type Props = {
    open: boolean,
    set_open: React.Dispatch<React.SetStateAction<boolean>>,
    set_lstRows: React.Dispatch<React.SetStateAction<ClassUpdate[]>>
}

const Trash = (props: Props) => {

    const {
        open = false,
        set_open = () => { },
        set_lstRows = () => { }
    } = props

    const SchoolYearSelect = useAppSelector(state => state.schoolyear.SchoolYearSelect) || ""

    const [lstRowsTrash, set_lstRowsTrash] = useState<ClassUpdate[]>([])
    const [selectRows, set_selectRows] = useState<React.Key[]>([])

    const onInitTrash = async () => {
        set_selectRows([])
        let { data } = await ListClassesInTrash(SchoolYearSelect)
        data?.length && set_lstRowsTrash(data)
    }

    const onDelInTrashClasses = async () => {
        let result = await DeleteClasses(selectRows, SchoolYearSelect)
        if (result) {
            notification.success({
                message: 'Thao tác thành công',
                duration: 3,
            })
            onInitTrash()
        } else {
            notification.error({
                message: 'Thao tác thất bại',
                duration: 3,
            })
        }
    }

    const onRestoreInTrashClasses = async () => {
        let result = await RestoreTrashToClasses(selectRows, SchoolYearSelect)
        if (result) {
            notification.success({
                message: 'Thao tác thành công',
                duration: 3,
            })
            onInitTrash()
        } else {
            notification.error({
                message: 'Thao tác thất bại',
                duration: 3,
            })
        }
    }

    useEffect(() => {
        open && onInitTrash()
        return () => {
            set_lstRows([])
            set_selectRows([])
        }
    }, [open])

    const columns: TableProps<ClassUpdate>['columns'] = useMemo(() => {
        if (lstRowsTrash.length) {
            return [
                {
                    title: 'Tên lớp học',
                    render: (_, record, index) => <Fragment>{record?.ClassName || ""}</Fragment>,
                },
                {
                    title: 'Khối',
                    render: (_, record, index) => {
                        return <Fragment>{record?.Grades}</Fragment>
                    },
                },
            ]
        }
        return []
    }, [lstRowsTrash])

    return (
        <Fragment>
            <Modal
                title={"Thùng rác Lớp học"}
                centered
                open={open}
                footer={null}
                onCancel={() => set_open(false)}
                width={"70vw"}
            >
                <Row className='mb-3'>
                    <Space>
                        <Button
                            type='primary'
                            danger
                            disabled={!selectRows.length}
                            onClick={onDelInTrashClasses}
                        >
                            Xóa vĩnh viễn
                        </Button>
                        <Button
                            type='primary'
                            disabled={!selectRows.length}
                            onClick={onRestoreInTrashClasses}
                        >
                            Khôi phục
                        </Button>
                    </Space>
                </Row>
                {lstRowsTrash.length
                    ? <Table
                        rowKey={"id"}
                        dataSource={lstRowsTrash}
                        columns={columns}
                        rowSelection={{
                            selectedRowKeys: selectRows,
                            onChange: (selectedRowKeys) => {
                                set_selectRows(selectedRowKeys)
                            },
                            onSelectAll: () => set_selectRows(lstRowsTrash.map(i => i.id) || [])
                        }}
                    />
                    : <Empty description="Hiện không có dữ liệu" style={{ marginTop: 24 }} />
                }

            </Modal>
        </Fragment>
    )
}

export default Trash