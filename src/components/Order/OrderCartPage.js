// "/order/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, ButtonBase, Avatar, TextField, Typography, Checkbox, Menu, MenuItem, Select, Divider, Button, Tooltip, IconButton, InputAdornment,
} from '@material-ui/core'
import { yujinserver, sangminserver } from '../../restfulapi';
import OrderList from './OrderList'
import { Delete } from '@material-ui/icons';
import { push } from 'connected-react-router';
import { pushToOrderList, cleanOrderList } from '../../actions/orderList';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import { red } from '@material-ui/core/colors';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    avatarImage: {
      width: '3em',
      height: '3em',
    },
    textFieldQuantity: {
      width: '3em',
    },
    typoTotal: {
      width: '6em',
    },
}));

const OrderCartPage = ({pushToOrderList, cleanOrderList, push}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(true)
  const [cartList, setCartList] = useState({
    orders: [],
    options: [],
    products: [],
  })
  const [cartListComponent, setCartListComponent] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if(loading){
      fetch(yujinserver+"/cart",{
        credentials: "include"
      })
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then((json) => {
        const options = json.result2n3.result2.reduce((result = {}, item) => {
          if(item.cnt !== 0){
            const id = item.productId
            if(!result[id]) result[id] = []
            result[id] = [...result[id], {optionId: item.id, color: item.color, size: item.size, cnt: item.cnt}]
          }
          return result
        }, {})
        const products = json.result2n3.result3.reduce((result, product) => {
          const id = product[0].id
          if(!result[id]) result[id] = []
          result[id] = product[0]
          return result
        }, {})
        const orders = json.cartsByUid
        setCartList({
          orders: orders,
          options: options,
          products: products,
        })
        setLoading(false)
      })
    }
  }, [loading])

  useEffect(() => {
    setCartListComponent(cartList.orders.map(order => {
      return(
        <CartItem key={order.id+"-"+order.color+"-"+order.size+"-"+order.cnt} order={order} product={cartList.products[order.productId]} options={cartList.options[order.productId]} reload={() => setLoading(true)} />
      )
    }))
    setTotal(cartList.orders.reduce((result, order) => {
      result += cartList.products[order.productId].price * order.cnt
      return result
    }, 0))
  }, [cartList])

  const purchaseCart = () => {
    if(!cartList.orders.length){
      enqueueSnackbar("먼저 옵션을 선택해주세요.",{"variant": "error"});
    }
    else{
      cleanOrderList();
      cartList.orders.map((option) => {
        pushToOrderList({
          pid: option.productId, 
          pname: option.pname, 
          color: option.color, 
          size: option.size, 
          quantity: option.cnt,
          price: cartList.products[option.productId].price, 
          img: option.img
        });
      })
      push('/order/placeorder');
    }
  }

  return(
    <Box display="flex" flexDirection="column">
      <Box>
        <Typography variant="h6">장바구니</Typography>
      </Box>
      <Divider />
      <Grid container direction="column">
        {cartListComponent}
      </Grid>
      <Divider />
      <Typography>총 금액: <strong>{total}</strong>원</Typography>
      <Button variant="contained" color="primary" onClick={() => purchaseCart()} >구매</Button>
    </Box>
  )
}

const mapStateToProps = state => ({
  // pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  pushToOrderList : (order) => dispatch(pushToOrderList(order)),
  cleanOrderList : () => dispatch(cleanOrderList()),
  push : (url) => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderCartPage)
