// "/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, 
  Avatar, 
  Box,
  Typography,
} from '@material-ui/core'
import { yujinserver } from '../../restfulapi';
import ShopSubheader from './ShopSubheader';
import OrderList from './OrderList';
import ShopProductItem from './ShopProductItem';

const useStyles = makeStyles((theme) => ({

}));

const ShopProductList = ({products, options, previews, reload}) => {
  const classes = useStyles();

  const defaultOptions = [{optionId: -1, color: '누끼없음', size: '사이즈없음', cnt: 0}]
  const defaultPreviews = [{color: '누끼없음', img: ''}]
  const productList = products.map((product) => {
    const productOptions = options[product.id] !== undefined? options[product.id]: defaultOptions
    const productPreviews = previews[product.id] !== undefined? previews[product.id]: defaultPreviews
    return(
      <ShopProductItem product={product} options={productOptions} previews={productPreviews} reload={reload} />
    )
  })

  return(
    <Grid container>
      {productList}
    </Grid>
  )
}

ShopProductList.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopProductList)
