import React, { Fragment, useState } from 'react'
import styled from "styled-components"
import Header from './components/Header'
import Table from './components/Table'
import Trash from './components/Trash'
import { ClassUpdate, EGrades } from '../../consts/types'
import ModalUpsertClass from './components/ModalUpsertClass'

const Wrapper = styled.section``

const Class = () => {

    const [lstRows, set_lstRows] = useState<ClassUpdate[]>([])
    const [selectRows, set_selectRows] = useState<React.Key[]>([])
    const [rowEditing, set_rowEditing] = useState<ClassUpdate | null>(null)
    const [open, set_open] = useState(false)
    const [openTrash, set_openTrash] = useState(false)
    const [HeaderParams, set_headerParams] = useState<EGrades>(EGrades.Khoi_1)

    return (
        <Fragment>
            <Wrapper>
                <Header
                    selectRows={selectRows}
                    set_lstRows={set_lstRows}
                    set_open={set_open}
                    set_openTrash={set_openTrash}
                    set_headerParams={set_headerParams}
                />
                <Table
                    lstRows={lstRows}
                    selectRows={selectRows}
                    set_open={set_open}
                    set_rowEditing={set_rowEditing}
                    set_selectRows={set_selectRows}
                />
                <ModalUpsertClass
                    open={open}
                    HeaderParams={HeaderParams}
                    rowEditing={rowEditing}
                    set_lstRows={set_lstRows}
                    set_open={set_open}
                    set_rowEditing={set_rowEditing}
                />
                {/* <Trash 
                   open={openTrash}
                   set_lstRows={set_lstRows}
                   set_open={set_openTrash}
                /> */}
            </Wrapper>
        </Fragment>
    )
}

export default Class