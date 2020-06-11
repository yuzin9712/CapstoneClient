// "/shop/mypage"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, 
  Box,
  Container,
} from '@material-ui/core'
import ShopSubheader from './ShopSubheader';
import { yujinserver } from '../../restfulapi';
import ShopProductList from './ShopProductList';
import Chart from '../Chart';

const useStyles = makeStyles((theme) => ({

}));

const ShopAnalyze = ({}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(loading){
      console.log("loading~")
    }
  }, [loading])

  return(
    <Container maxWidth="md">
      <ShopSubheader />
      <Chart />
    </Container>
  )
}

ShopAnalyze.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopAnalyze)