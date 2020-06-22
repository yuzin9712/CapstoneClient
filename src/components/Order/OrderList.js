// 장바구니,상품구매에서 보는 상품목록표
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    ButtonBase
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root:{
      flexGrow: 1,
      '& > *': {
        padding: theme.spacing(1),
      },
    },
    thumbnail: {
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    price: {
      color: theme.palette.primary.main
    },
    formControl: {
      width: '100%',
    },
    table: {

    },
    hide: {
      display: 'none',
    },
    contentPanel: {
      
    }
}));

const OrderList = ({orders, edit}) => {
  const classes = useStyles();


  useEffect(() => {
    
  }, [orders]);

  // if(!orderList.length) return(<div>wait</div>)
  const productListRows = !orders.length?
      <TableRow>
          <TableCell colSpan={4} align="center">상품을 선택하지 않았습니다!</TableCell>
      </TableRow>
      :orders.map((product) => {
          return(
              <TableRow>
                <TableCell>
                  <Grid container alignItems="center">
                    <ButtonBase>
                      <img src={product.img} alt={product.pname} width="100px"/>
                    </ButtonBase>
                      {product.pname}
                  </Grid></TableCell>
                <TableCell>{product.color} / {product.size}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.price * product.quantity}원</TableCell>
              </TableRow>
          )
  });
  return(
      <Grid>
          <Table>
              <TableHead>
                  <TableRow>
                      <TableCell>상품명</TableCell>
                      <TableCell>옵션</TableCell>
                      <TableCell>수량</TableCell>
                      <TableCell>금액</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {productListRows}
              </TableBody>
          </Table>
      </Grid>
  )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps)(OrderList)