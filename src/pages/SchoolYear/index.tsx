import { Fragment, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs';
import { Table } from 'antd'
import { nanoid } from '@reduxjs/toolkit';
import type { TableProps } from 'antd';
import type { SchoolYear } from '../../consts/types';

const SchoolYear = () => {

  const [lstRows, set_lstRows] = useState<SchoolYear[]>([])
  const columns: TableProps<SchoolYear>['columns'] = useMemo(() => {
    if (lstRows.length) {
      return [
        {
          title: 'Tên Năm Học',
          key: nanoid(),
          render: ({record}) => <Fragment>{record?.YearName || ""}</Fragment>,
        },
        {
          title: 'Thời gian hoạt động',
          key: nanoid(),
          render: ({record}) => {
            let dateStartEnd = (dayjs(record?.Start) + " - " + dayjs(record?.End)) || ""
            return <Fragment>{dateStartEnd}</Fragment>
          },
        },
        {
          title: 'Trạng thái',
          key: nanoid(),
          render: ({record}) => {
            let arrText = ["Hoạt động", "Không hoạt động"]
            return <Fragment>{arrText[record?.Status] || ""}</Fragment>
          },
        },
      ]
    }
    return []
  }, [lstRows])

  useEffect(() => {
    set_lstRows([])
  }, [])

  return <Fragment>
    <Table
      dataSource={lstRows}
      columns={columns}
    />
  </Fragment>
}

export default SchoolYear