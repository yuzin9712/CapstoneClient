// "/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Container,
} from '@material-ui/core'
import { yujinserver } from '../../restfulapi';
import ShopSubheader from './ShopSubheader';
import OrderList from './OrderList';

const useStyles = makeStyles((theme) => ({

}));

const ShopOrders = ({}) => {
  const classes = useStyles();
  const [orderList, setOrderList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [carriers, setCarriers] = useState([])

  useEffect(() => {
    fetch('https://apis.tracker.delivery/carriers')
    .then(
      (res) => res.json(),
      (error) => console.error(error)
    )
    .then((json) => setCarriers(json))
  }, [])
  useEffect(() => {
    if(loading && carriers.length > 0){
      fetch(yujinserver+'/shop/orders',{
        credentials: 'include',
      })
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then((data) => {
        setOrderList(<OrderList orders={data} carriers={carriers} reload={() => setLoading(true)} />)
        setLoading(false)
      })
    }
  }, [loading, carriers])

  return(
    <Container maxWidth="md">
      <ShopSubheader />
      {orderList}
    </Container>
  )
}

ShopOrders.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopOrders)
