import { Button, Row, Space, Typography, notification } from 'antd';
import React, { Fragment } from 'react';
import { SchoolYearUpdate } from '../../../consts/types';
import { DelToTrashSchoolYear, ListSchoolYear } from '../../../services/SchoolYear';

type Props = {
	selectRows: React.Key[],
	set_lstRows: (arg: SchoolYearUpdate[]) => void,
	set_open: (bol: boolean) => void,
	set_openTrash: (bol: boolean) => void,
	set_selectRows: (key: React.Key[]) => void
}

const Header = (props: Props) => {

	const {
		selectRows = [],
		set_lstRows = () => { },
		set_open = () => { },
		set_openTrash = () => { },
		set_selectRows = () => { },
	} = props

	const onDelRowstoTrash = async () => {
		let result = await DelToTrashSchoolYear(selectRows)
		if (result) {
			set_selectRows([])
			notification.success({
				message: 'Thao tác thành công',
				duration: 3,
			})
			const { data: listSchool } = await ListSchoolYear()
			set_lstRows(listSchool)
		} else {
			notification.error({
				message: 'Thao tác thất bại',
				duration: 3,
			})
		}
	}

	return <Fragment>
		<Typography.Title level={4}>
			Quản lý năm học
		</Typography.Title>
		<Row style={{ marginBottom: 24 }} justify={"space-between"}>
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
			</Space>
			<Button
				type='primary'
				onClick={() => set_open(true)}>
				Thêm mới
			</Button>
		</Row>
	</Fragment>
}

export default Header