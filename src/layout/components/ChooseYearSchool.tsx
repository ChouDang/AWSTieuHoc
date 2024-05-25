import { Fragment, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { handleSchoolYearHubThunk, updateLstSchoolYear, updateSchoolYearSelect } from '../../redux/SchoolYear/SchoolYearSilice';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { ListSchoolYear } from '../../services/SchoolYear';
import { Select } from 'antd';

const client = generateClient<Schema>();

const ChooseYearSchool = () => {

    const dispatch = useAppDispatch()
    const LstSchoolYear = useAppSelector(state => state.schoolyear.LstSchoolYear)
    const SchoolYearSelect = useAppSelector(state => state.schoolyear.SchoolYearSelect)

    const onInit = async () => {
        let { data } = await ListSchoolYear()
        let optSchoolYear = data.map(i => ({
            ...i,
            value: i.id,
            label: i.YearName,
        }))
        dispatch(updateLstSchoolYear(optSchoolYear))
        let objActive = optSchoolYear.find(i => i.Status == "Active")
        objActive && dispatch(updateSchoolYearSelect(objActive.id))
    }

    useEffect(() => { onInit() }, [])
    useEffect(() => {
        // Subscribe to creation of.SchoolYear
        const createSub = client.models.SchoolYear.onCreate().subscribe({
            next: async (data) => await dispatch(handleSchoolYearHubThunk({ ...data, type: "create" })),
            error: (error) => console.warn(error),
        });
        // Subscribe to update of.SchoolYear
        const updateSub = client.models.SchoolYear.onUpdate().subscribe({
            next: async (data) => await dispatch(handleSchoolYearHubThunk({ ...data, type: "update" })),
            error: (error) => console.warn(error),
        });
        // Subscribe to deletion of.SchoolYear
        const deleteSub = client.models.SchoolYear.onDelete().subscribe({
            next: async (data) => await dispatch(handleSchoolYearHubThunk({ ...data, type: "delete" })),
            error: (error) => console.warn(error),
        });
        return () => {
            createSub.unsubscribe();
            updateSub.unsubscribe();
            deleteSub.unsubscribe();
        }
    }, [])

    return <Fragment>
        <Select
            style={{ minWidth: 200 }}
            value={SchoolYearSelect}
            options={LstSchoolYear}
            onChange={(e) => dispatch(updateSchoolYearSelect(e))}
        />
    </Fragment>
}

export default ChooseYearSchool