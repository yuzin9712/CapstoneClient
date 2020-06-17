// "/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
  Grid,
  Typography,
  Box,
} from '@material-ui/core'
import ClosetCard from './ClosetCard';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({

}));

const ClosetList = ({closets, reload}) => {
    const [ closetCards, setClosetCards ] = useState(null)

    useEffect(() => {
        if(closets){
            if(closets.length) setClosetCards(closets.map((closet) => {
                return <ClosetCard closet={closet} reload={() => reload()} />
            }))
            else setClosetCards(<Typography gutterBottom>저장된 코디가 없습니다. 코디를 만들어보세요!</Typography>)
        }
        else setClosetCards(<Typography gutterBottom>저장된 코디가 없습니다. 코디를 만들어보세요!</Typography>)
    }, [closets])
    
    return(
      <Grid container>
        {closetCards}
      </Grid>
    )
}

ClosetList.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosetList)
