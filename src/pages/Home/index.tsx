import React, { Fragment } from 'react'
import { useAppSelector, useAppDispatch } from '../../redux/hook'
import { decrement, increment } from '../../redux/Home/HomeSlice'
import styled from 'styled-components'

type Props = {}

const WrapperHome = styled.div``

const Home = (props: Props) => {

    const count = useAppSelector(state => state.home.value)
    const dispatch = useAppDispatch()
    console.log(count, "count")
    return (
        <Fragment>
            <div onClick={() => dispatch(increment())} >test redux increment</div>
            <div className='my-2' onClick={() => dispatch(decrement())} >test redux decrement</div>
            <WrapperHome>
                Home
            </WrapperHome>
        </Fragment>
    )
}

export default Home