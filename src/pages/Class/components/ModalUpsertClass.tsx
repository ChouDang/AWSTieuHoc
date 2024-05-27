import React, { useEffect } from 'react'
import { ClassUpdate, EGrades } from '../../../consts/types'
import { useForm, Controller } from 'react-hook-form'
import { Col, Input, Modal, Row, Select, notification } from 'antd'
import { optGrades } from '../../../consts'
import { CreateClass, GetByIdClass, UpdateClass } from '../../../services/Class'
import { useAppSelector } from '../../../redux/hook'

type Props = {
    open: boolean,
    rowEditing: ClassUpdate | null,
    set_lstRows: React.Dispatch<React.SetStateAction<ClassUpdate[]>>,
    set_open: (bol: boolean) => void,
    set_rowEditing: (row: ClassUpdate | null) => void
    HeaderParams: EGrades,
}

const ModalUpsertClass = (props: Props) => {

    const {
        open = false,
        rowEditing = null,
        set_lstRows = () => { },
        set_open = () => { },
        set_rowEditing = () => { },
        HeaderParams,
    } = props

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, errors }
    } = useForm<ClassUpdate>()

    const SchoolYearSelect = useAppSelector(state => state.schoolyear.SchoolYearSelect) || ""

    const onSubmit = async (formValues: ClassUpdate) => {
        let model = { ...formValues }
        if (rowEditing?.id) {
        } else {
            model = {
                ...model,
                SchoolYearId: SchoolYearSelect,
                inTrash: false,
            }
        }
        let { data } = rowEditing?.id
            ? await UpdateClass(model)
            : await CreateClass(model)
        if (data) {
            if (rowEditing?.id) {
                if (HeaderParams == model.Grades) {
                    set_lstRows(pre => ([...pre.map(i => i.id == data.id ? data : i)]))
                } else {
                    set_lstRows(pre => ([...pre.filter(i => i.id != data.id)]))
                }

            } else {
                if (HeaderParams == model.Grades) {
                    set_lstRows(pre => ([data, ...pre]))
                }
            }
            notification.success({
                duration: 3,
                message: "Thao tác thành công"

            })
            set_open(false)
        } else {
            notification.error({
                duration: 3,
                message: "Thao tác thất bại"
            })
        }
    }

    useEffect(() => {
        (async () => {
            if (open) {
                if (rowEditing?.id) {
                    let { data } = await GetByIdClass(rowEditing?.id)
                    if (data) {
                        reset(data)
                    }
                }
            } else {
                reset()
            }
        })()
    }, [open])

    return (
        <Modal
            title={`${rowEditing?.id ? "Chỉnh sửa" : "Thêm mới"} lớp học`}
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
            onCancel={() => {
                set_open(false)
                set_rowEditing(null)
            }}
        >
            <Row>
                <Col span={24}>
                    <Controller
                        name={"ClassName"}
                        control={control}
                        rules={{
                            required: true
                        }}
                        render={({ field: { onChange, onBlur, value, ref } }) => {
                            return <Row>
                                <div><span>Tên lớp học</span></div>
                                <Input
                                    className='w-100'
                                    placeholder='Nhập tên lớp học'
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value as string}
                                    ref={ref}
                                />
                                {errors?.ClassName && <span style={{ color: "red", fontSize: 13 }} >Không được để trống</span>}
                            </Row>
                        }}
                    />
                </Col>
                <Col span={24}>
                    <Controller
                        name={"Grades"}
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref } }) => {
                            return <Row>
                                <div><span>Khối học</span></div>
                                <Select
                                    className='w-100'
                                    placeholder='Chọn trạng thái'
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value as string}
                                    ref={ref}
                                    defaultValue={value as string}
                                    options={optGrades.num}
                                />
                            </Row>
                        }}
                    />
                </Col>
            </Row>
        </Modal>
    )
}

export default ModalUpsertClass