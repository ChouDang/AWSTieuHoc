import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { SchoolYearUpdate } from '../../../consts/types'
import { Button, Empty, Modal, Row, Space, Table, TableProps, notification } from 'antd'
import { nanoid } from '@reduxjs/toolkit'
import { DeleteSchoolYears, ListSchoolYearInTrash, RestoreTrashToSchoolYear } from '../../../services/SchoolYear'

type Props = {
	open: boolean,
	set_open: (bol: boolean) => void,
	onInit: VoidFunction,
}

const Trash = (props: Props) => {

	const {
		open = false,
		set_open = () => { },
		onInit = () => { },
	} = props

	const [lstRows, set_lstRows] = useState<SchoolYearUpdate[]>([])
	const [selectRows, set_selectRows] = useState<React.Key[]>([])

	const onInitTrash = async () => {
		set_selectRows([])
		let { data } = await ListSchoolYearInTrash()
		data && set_lstRows(data)
	}

	const onDelInTrashSchoolYear = async () => {
		let result = await DeleteSchoolYears(selectRows)
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

	const onRestoreInTrashSchoolYear = async () => {
		let result = await RestoreTrashToSchoolYear(selectRows)
		if (result) {
			notification.success({
				message: 'Thao tác thành công',
				duration: 3,
			})
			onInitTrash()
			onInit()
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
						let dateStartEnd = (record?.Start + " - " + record?.End) || ""
						return <Fragment>{dateStartEnd}</Fragment>
					},
				},
			]
		}
		return []
	}, [lstRows])

	return <Fragment>
		<Modal
			title={"Thùng rác Năm học"}
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
						onClick={onDelInTrashSchoolYear}
					>
						Xóa vĩnh viễn
					</Button>
					<Button
						type='primary'
						disabled={!selectRows.length}
						onClick={onRestoreInTrashSchoolYear}
					>
						Khôi phục
					</Button>
				</Space>
			</Row>
			{lstRows.length
				? <Table
					rowKey={"id"}
					dataSource={lstRows}
					columns={columns}
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

		</Modal>
	</Fragment>
}

export default Trash