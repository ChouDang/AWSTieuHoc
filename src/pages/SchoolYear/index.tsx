import { Fragment, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs';
import { Button, Empty, Input, Modal, Row, Table, Typography, DatePicker, Select, Col, notification, Space } from 'antd'
import { nanoid } from '@reduxjs/toolkit';
import type { TableProps } from 'antd';
import type { SchoolYear } from '../../consts/types';
import { CreateSchoolYear, DelToTrashSchoolYear, DeleteSchoolYears, GetByIdSchoolYear, ListSchoolYear, UpdateSchoolYear } from '../../services/SchoolYear';
import { useForm, Controller } from "react-hook-form"
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { optStatusYear } from './consts';
dayjs.extend(customParseFormat);

const dateFormatList = 'DD-MM-YYYY'

const SchoolYear = () => {

	const [lstRows, set_lstRows] = useState<SchoolYear[]>([])
	const [rowEditing, set_rowEditing] = useState<SchoolYear | null>(null)
	const [selectRows, set_selectRows] = useState<React.Key[]>([])
	const [open, set_open] = useState(false);
	const [openTrash, set_openTrash] = useState(false);

	const { control, handleSubmit, reset } = useForm<SchoolYear>()

	const onSubmit = async (formValues: SchoolYear) => {
		let model = {
			...formValues,
			End: dayjs(formValues.End).format("YYYY-MM-DD"),
			Start: dayjs(formValues.Start).format("YYYY-MM-DD"),
			inTrash: false,
		}
		const { data: result, errors } = model?.id 
		? await CreateSchoolYear(model)
		: await UpdateSchoolYear(model)
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

	const columns: TableProps<SchoolYear>['columns'] = useMemo(() => {
		if (lstRows.length) {
			return [
				{
					title: 'Tên Năm Học',
					key: nanoid(),
					render: (_, record, index) => <Fragment>{record?.YearName || ""}</Fragment>,
				},
				{
					title: 'Thời gian hoạt động',
					key: nanoid(),
					render: (_, record, index) => {
						let dateStartEnd = (record?.Start + " - " + record?.End) || ""
						return <Fragment>{dateStartEnd}</Fragment>
					},
				},
				{
					title: 'Trạng thái',
					key: nanoid(),
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

	useEffect(() => {
		(async () => {
			const { data: listSchool } = await ListSchoolYear()
			set_lstRows(listSchool)
		})()
	}, [])

	useEffect(() => {
		(async () => {
			if (open) {
				if (rowEditing?.id) {
					const { data } = await GetByIdSchoolYear(rowEditing?.id)
					if (data) {
						data.Start = dayjs(data.Start).format(dateFormatList)
						data.End = dayjs(data.End).format(dateFormatList)
						reset(data)
					}
				} else {
					reset({
						Status: "Inactive"
					})
				}
			}
		})()
	}, [open])

	return <Fragment>
		<Typography.Paragraph aria-level={1}>
			Năm Học
		</Typography.Paragraph>
		<Row style={{ marginBottom: 24 }} justify={"space-between"}>
			<Space size={16}>
				<Button
					type='primary'
					onClick={async() =>{
					 	await DelToTrashSchoolYear(selectRows)
						const { data: listSchool } = await ListSchoolYear()
						set_lstRows(listSchool)
					} }>
					Xóa
				</Button>
				<Button
					type='primary'
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
					onChange: (selectedRowKeys) =>{
						set_selectRows(selectedRowKeys)
					},
					onSelectAll: () => set_selectRows(lstRows.map(i => i.id) || [])
				}}
			/>
			: <Empty description="Hiện không có dữ liệu" style={{ marginTop: 24 }} />
		}
		<Modal
			title={`${rowEditing?.id ? "Chỉnh sửa" : "Thêm mới"} năm học`}
			centered
			open={open}
			okText={"Xác nhận"}
			cancelText={"Hủy"}
			onOk={() => {
				handleSubmit(onSubmit)()
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
							</Row>
						}}
					/>
				</Col>
				<Col span={24}>
					<Controller
						name={"Start"}
						control={control}
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
							</Row>
						}}
					/>
				</Col>
				<Col span={24}>
					<Controller
						name={"End"}
						control={control}
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
	</Fragment >
}

export default SchoolYear