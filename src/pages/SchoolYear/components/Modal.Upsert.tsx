import { Fragment, useEffect } from 'react';
import { Col, DatePicker, Input, Modal, Row, Select, notification } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Controller, useForm } from "react-hook-form";
import { SchoolYear, SchoolYearUpdate } from '../../../consts/types';
import { CreateSchoolYear, GetByIdSchoolYear, ListSchoolYear, UpdateSchoolYear } from '../../../services/SchoolYear';
import { optStatusYear } from '../consts';
dayjs.extend(customParseFormat);

const dateFormatList = 'DD-MM-YYYY'

type Props = {
  open: boolean,
  rowEditing: SchoolYearUpdate | null,
  set_lstRows: (lst: SchoolYearUpdate[]) => void,
  set_open: (bol: boolean) => void,
  set_rowEditing: (row: SchoolYearUpdate | null) => void
}

const ModalUpsert = (props: Props) => {

  const {
    open = false,
    rowEditing = null,
    set_lstRows = () => { },
    set_open = () => { },
    set_rowEditing = () => { },
  } = props

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors }
  } = useForm<SchoolYearUpdate>()

  const onSubmit = async (formValues: SchoolYearUpdate) => {
    if (dayjs(formValues.Start).isAfter(formValues.End)) {
      return notification.error({
        message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc',
        duration: 3,
      })
    }
    let model = {...formValues}
    if (rowEditing?.id) {
      let [days, months, years] = formValues.Start.split("-")
      let [daye, monthe, yeare] = formValues.End.split("-")
          model = {
        ...formValues,
        Start: `${years + "-" + months + "-" + days}`,
        End: `${yeare + "-" + monthe + "-" + daye}`,
        inTrash: false,
      }
    } else {
      let [days, months, years] = dayjs(formValues.Start).format(dateFormatList).split("-")
      let [daye, monthe, yeare] = dayjs(formValues.End).format(dateFormatList).split("-")
      model = {
        ...formValues,
        Start: `${years + "-" + months + "-" + days}`,
        End: `${yeare + "-" + monthe + "-" + daye}`,
        inTrash: false,
      }
    }

    const { data: result, errors } = model?.id
      ? await UpdateSchoolYear(model)
      : await CreateSchoolYear(model)
    if (result) {
      notification.success({
        message: 'Thao tác thành công',
        duration: 3,
      })
      const { data: listSchool } = await ListSchoolYear()
      set_lstRows(listSchool)
      set_open(false)
    } else {
      notification.error({
        message: 'Thao tác thất bại',
        description: errors?.[0]?.message || "",
        duration: 3,
      })
    }
  }

  const onInitModalUpsert = async () => {
    if (rowEditing?.id) {
      const { data } = await GetByIdSchoolYear(rowEditing?.id)
      if (data) {
        let convertData = { ...data }
        convertData.Start = dayjs(data.Start).format(dateFormatList)
        convertData.End = dayjs(data.End).format(dateFormatList)
        reset(convertData)
      }
    } else {
      reset({
        Status: "Inactive"
      })
    }
  }

  useEffect(() => {
    open && onInitModalUpsert()
    return () => reset({ Status: "Inactive" })
  }, [open])

  return <Fragment>
    <Modal
      title={`${rowEditing?.id ? "Chỉnh sửa" : "Thêm mới"} năm học`}
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
            name={"YearName"}
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return <Row>
                <div><span>Tên năm học</span></div>
                <Input
                  className='w-100'
                  placeholder='Nhập năm học'
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value as string}
                  ref={ref}
                />
                {errors?.YearName && <span style={{ color: "red", fontSize: 13 }} >Không được để trống</span>}
              </Row>
            }}
          />
        </Col>
        <Col span={24}>
          <Controller
            name={"Start"}
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value, ref } }) => {
              return <Row>
                <div><span>Ngày bắt đầu</span></div>
                <DatePicker
                  className='w-100'
                  ref={ref}
                  value={value ? dayjs(value, dateFormatList) : null}
                  placeholder='Chọn ngày bắt đầu'
                  format={dateFormatList}
                  onChange={onChange}
                />
                {errors?.Start && <span style={{ color: "red", fontSize: 13 }} >Không được để trống</span>}
              </Row>
            }}
          />
        </Col>
        <Col span={24}>
          <Controller
            name={"End"}
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value, ref } }) => {
              return <Row>
                <div><span>Ngày kết thúc</span></div>
                <DatePicker
                  className='w-100'
                  ref={ref}
                  value={value ? dayjs(value, dateFormatList) : null}
                  placeholder='Chọn ngày kết thúc'
                  format={dateFormatList}
                  onChange={onChange}
                />
                {errors?.End && <span style={{ color: "red", fontSize: 13 }} >Không được để trống</span>}
              </Row>
            }}
          />
        </Col>
        <Col span={24}>
          <Controller
            name={"Status"}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return <Row>
                <div><span>Trạng thái năm học</span></div>
                <Select
                  className='w-100'
                  placeholder='Chọn trạng thái'
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value as string}
                  ref={ref}
                  defaultValue={value as string}
                  options={optStatusYear}
                />
              </Row>
            }}
          />
        </Col>
      </Row>
    </Modal>
  </Fragment>
}

export default ModalUpsert