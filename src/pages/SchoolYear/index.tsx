import { Fragment, useEffect, useState } from 'react';
import type { SchoolYearUpdate } from '../../consts/types';
import { ListSchoolYear } from '../../services/SchoolYear';
import Header from './components/Header';
import Table from './components/Table';
import ModalUpsert from './components/Modal.Upsert';
import Trash from './components/Trash';

const SchoolYear = () => {

	const [lstRows, set_lstRows] = useState<SchoolYearUpdate[]>([])
	const [rowEditing, set_rowEditing] = useState<SchoolYearUpdate | null>(null)
	const [selectRows, set_selectRows] = useState<React.Key[]>([])
	const [open, set_open] = useState(false);
	const [openTrash, set_openTrash] = useState(false);

	const onInit = async () => {
		const { data: listSchool } = await ListSchoolYear()
		listSchool.length && set_lstRows(listSchool)
	}

	useEffect(() => { onInit() }, [])

	return <Fragment>
		<Header
			selectRows={selectRows}
			set_lstRows={set_lstRows}
			set_open={set_open}
			set_openTrash={set_openTrash}
			set_selectRows={set_selectRows}
		/>
		<Table
			lstRows={lstRows}
			selectRows={selectRows}
			set_open={set_open}
			set_rowEditing={set_rowEditing}
			set_selectRows={set_selectRows}
		/>
		<ModalUpsert
			open={open}
			rowEditing={rowEditing}
			set_lstRows={set_lstRows}
			set_open={set_open}
			set_rowEditing={set_rowEditing}
		/>
		<Trash
			open={openTrash}
			set_open={set_openTrash}
			onInit={onInit}
		/>
	</Fragment >
}

export default SchoolYear