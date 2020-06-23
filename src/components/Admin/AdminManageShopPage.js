// "/admin/manageShop"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Container,
} from '@material-ui/core'
import Trade from '../Trade'
import AdminSubheader from './ShopSubheader';
import { useSnackbar } from 'notistack';
import { push } from 'connected-react-router';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none'
  },
}));

const AdminManageShopPage = ({authStore, push}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if(authStore.session !== 'admin'){
      enqueueSnackbar("권한이 없습니다.",{"variant": "error"});
      push("/")
    }
  }, [authStore])

  return(
    <Box display="flex" flexDirection="column" className={clsx({
      [classes.hide]: authStore.session !== 'admin'
    })}>
      <AdminSubheader />
      <Trade />
    </Box>
  )
}

AdminManageShopPage.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  authStore: state.auth
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminManageShopPage)
