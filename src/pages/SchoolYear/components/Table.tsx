import { Empty, Table as TableAntd, TableProps } from 'antd'
import { Fragment, useMemo } from 'react'
import { SchoolYearUpdate } from '../../../consts/types'
import { nanoid } from '@reduxjs/toolkit'

type Props = {
  lstRows: SchoolYearUpdate[],
  selectRows: React.Key[] | string[],
  set_open: (bool: boolean) => void
  set_rowEditing: (arg: SchoolYearUpdate | null) => void,
  set_selectRows: (key: React.Key[] | string[]) => void,
}

const Table = (props: Props) => {

  const {
    lstRows = [],
    selectRows = [],
    set_open = () => { },
    set_rowEditing = () => { },
    set_selectRows = () => { },
  } = props


  const columns: TableProps<SchoolYearUpdate>['columns'] = useMemo(() => {
    if (lstRows.length) {
      return [
        {
          title: 'Tên Năm Học',
          render: (_, record, index) => <Fragment>{record?.YearName || ""}</Fragment>,
        },
        {
          title: 'Thời gian hoạt động',
          render: (_, record, index) => {
            let [years, months, days] = record?.Start.split("-")
            let [yeare, monthe, daye] = record?.End.split("-")
            let dateStartEnd = (days + "-" + months + "-" + years + " - " + daye + "-" + monthe + "-" + yeare) || ""
            return <Fragment>{dateStartEnd}</Fragment>
          },
        },
        {
          title: 'Trạng thái',
          render: (_, record, index) => {
            let objText = {
              Active: "Hoạt động",
              Inactive: "Không hoạt động"
            }
            return <Fragment>{record?.Status && (objText[record?.Status] || "")}</Fragment>
          },
        },
      ]
    }
    return []
  }, [lstRows])


  return <Fragment>
    {lstRows.length
      ? <TableAntd
        rowKey={"id"}
        dataSource={lstRows}
        columns={columns}
        onRow={(record) => ({
          onDoubleClick: () => {
            set_rowEditing(record)
            set_open(true)
          },
        })}
        rowSelection={{
          selectedRowKeys: selectRows,
          onChange: (selectedRowKeys) => {
            set_selectRows(selectedRowKeys)
          },
          onSelectAll: () => set_selectRows(lstRows.map(i => i.id) || [])
        }}
      />
      : <Empty description="Hiện không có dữ liệu" style={{ marginTop: 24 }} />
    }
  </Fragment>
}

export default Table