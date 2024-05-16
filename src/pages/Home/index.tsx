import { Fragment } from 'react'
import styled from 'styled-components' 
import { decrement, increment } from '../../redux/Home/HomeSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hook'

const WrapperHome = styled.div``

const Home = () => {

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