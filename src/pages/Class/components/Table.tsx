import React, { Fragment, useMemo } from 'react'
import { ClassUpdate } from '../../../consts/types'
import { Empty, TableProps } from 'antd'
import TableAntd from '../../../controls/Table/TableAntd'

type Props = {
  lstRows: ClassUpdate[],
  selectRows: React.Key[] | string[],
  set_open: (bool: boolean) => void
  set_rowEditing: (arg: ClassUpdate | null) => void,
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

  const columns: TableProps<ClassUpdate>['columns'] = useMemo(() => {
    if (lstRows.length) {
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
  }, [lstRows])

  return (
    <Fragment>
      <TableAntd
        lstRows={lstRows}
        columns={columns}
        selectRows={selectRows}
        set_open={set_open}
        set_rowEditing={set_rowEditing}
        set_selectRows={set_selectRows}
      />
    </Fragment>
  )
}

export default Table