// "/admin/manageShop"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Container,
} from '@material-ui/core'
import Trade from '../Trade'

const useStyles = makeStyles((theme) => ({

}));

const AdminManageShopPage = ({post}) => {
  const classes = useStyles();

  return(
    <Container maxWidth="md">
      <Trade />
    </Container>
  )
}

AdminManageShopPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminManageShopPage)
