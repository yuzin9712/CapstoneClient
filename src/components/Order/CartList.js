// "/order/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, ButtonBase, Avatar, TextField, Typography, Checkbox, Menu, MenuItem, Select, Divider, Button, Tooltip, IconButton, InputAdornment,
} from '@material-ui/core'
import { yujinserver } from '../../restfulapi';
import OrderList from './OrderList'
import { Delete } from '@material-ui/icons';
import { push } from 'connected-react-router';
import { pushToOrderList, cleanOrderList } from '../../actions/orderList';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';

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

const CartList = ({cartList, products, options, edit}) => {
  const classes = useStyles();
//   const [cartItems, setCartItems] = useState(null)
  
  const cartItems = cartList.map((order) => (
    <CartItem order={order} product={products[order.productId]} options={options[order.productId]} edit={edit} />
  ))
  const editButtons = (
    <Box display="flex" flexDirection="row" justifyContent="flex-end">
      <Button variant="outlined" disabled>선택삭제</Button>
      <Button variant="outlined" disabled>전체삭제</Button>
    </Box>
  )

  return(
    <Box>
      <Box>
        {cartItems}
      </Box>
      {edit? editButtons:null}
      <Divider />
      <Typography gutterBottom>총 가격: 얼마얼마원</Typography>
    </Box>
  )
}

CartList.propTypes = {
    pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    pushToOrderList : (order) => dispatch(pushToOrderList(order)),
    cleanOrderList : () => dispatch(cleanOrderList()),
    push : (url) => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CartList)