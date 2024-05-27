import React, { Fragment } from 'react'
import { Empty, Table, TableProps } from 'antd'

type Props<T> = {
    lstRows: T[],
    columns: TableProps<T>['columns'] ,
    selectRows: React.Key[] | string[],
    set_open: (bool: boolean) => void
    set_rowEditing: (arg: T | null) => void,
    set_selectRows: (key: React.Key[] | string[]) => void,
}

const TableAntd =<T extends { id: string }>(props: Props<T>) => {
    const {
        lstRows = [],
        columns = [],
        selectRows = [],
        set_open = () => { },
        set_rowEditing = () => { },
        set_selectRows = () => { },
      } = props
    return (
        <Fragment>
            {lstRows.length
                ? <Table
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
    )
}

export default TableAntd