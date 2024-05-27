import { TableProps } from 'antd'
import { Fragment, useMemo } from 'react'
import { SchoolYearUpdate } from '../../../consts/types'
import TableAntd from '../../../controls/Table/TableAntd'


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
    <TableAntd
      lstRows={lstRows}
      columns={columns}
      selectRows={selectRows}
      set_open={set_open}
      set_rowEditing={set_rowEditing}
      set_selectRows={set_selectRows}
    />
  </Fragment>
}

export default Table