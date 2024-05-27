import { Button, Col, Row, Select, Space, notification } from 'antd'
import React, { Fragment, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { optGrades } from '../../../consts'
import { ClassUpdate, EGrades } from '../../../consts/types'
import { DeleteClassToTrash, ListClassesByGrade } from '../../../services/Class'
import { useAppSelector } from '../../../redux/hook'

type Props = {
  selectRows: React.Key[],
  set_lstRows: React.Dispatch<React.SetStateAction<ClassUpdate[]>>,
  set_selectRows: React.Dispatch<React.SetStateAction<React.Key[]>>,
  set_open: (bol: boolean) => void,
  set_openTrash: (bol: boolean) => void,
  set_headerParams: (grade: EGrades) => void,
}

type FormClassHeader = {
  fKhoi: string,
}

const Header = (props: Props) => {

  const {
    selectRows = [],
    set_selectRows = () => { },
    set_lstRows = () => { },
    set_open = () => { },
    set_openTrash = () => { },
    set_headerParams = () => { },
  } = props

  const {
    control,
    reset,
  } = useForm<FormClassHeader>()

  const SchoolYearSelect = useAppSelector(state => state.schoolyear.SchoolYearSelect) || ""

  const onInitClass = async (_eKhoi: EGrades = EGrades.Khoi_1) => {
    if (SchoolYearSelect?.length) {
      const { data } = await ListClassesByGrade(_eKhoi, SchoolYearSelect)
      if (data?.length) {
        set_lstRows(data as ClassUpdate[])
      } else {
        set_lstRows([])
      }
    }
  }

  const onDelRowstoTrash = async () => {
    let result = await DeleteClassToTrash(selectRows, SchoolYearSelect)
    if (result) {
      set_lstRows(pre => ([...pre.filter(i => selectRows.includes(i.id))]))
      set_selectRows([])
      notification.success({
        message: "Thao tác thành công",
        duration: 3
      })
    } else {
      notification.error({
        message: "Thao tác thất bại",
        duration: 3
      })
    }
  }

  useEffect(() => {
    reset({
      fKhoi: EGrades.Khoi_1
    })
    onInitClass(EGrades.Khoi_1)
  }, [SchoolYearSelect])

  return (
    <Fragment>
      <Row justify={"space-between"} className='mb-3' >
        <Col>
          <Controller
            name={"fKhoi"}
            control={control}
            render={({ field: { onChange, value, ref } }) => {
              return <Row>
                <Select
                  className='w-100'
                  placeholder='Chọn khối'
                  onChange={e => {
                    onChange(e)
                    onInitClass(e)
                    set_headerParams(e)
                    set_selectRows([])
                  }}
                  value={value as EGrades}
                  ref={ref}
                  defaultValue={value as EGrades}
                  options={optGrades.text}
                />
              </Row>
            }}
          />
        </Col>
        <Col>
          <Space size={16}>
            <Button
              type='primary'
              danger
              disabled={!selectRows.length}
              onClick={onDelRowstoTrash}>
              Xóa
            </Button>
            <Button
              onClick={() => set_openTrash(true)}>
              Thùng rác
            </Button>
            <Button
              type='primary'
              onClick={() => set_open(true)}>
              Thêm mới
            </Button>
          </Space>
        </Col>
      </Row>
    </Fragment >
  )
}

export default Header