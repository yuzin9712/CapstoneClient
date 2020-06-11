// "/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Button, ButtonBase, Avatar,
} from '@material-ui/core'
import { sangminserver } from '../../restfulapi';
import { sketchResetItems } from '../../actions/sketch';
// import fabric from 'fabric'
const fabric = window.fabric

const useStyles = makeStyles((theme) => ({
  paletteImage: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  }
}));

const SketchItem = ({ src }) => {
  const classes = useStyles();

  return(
    <Avatar draggable className={classes.paletteImage} src={product} variant="rounded" />
  )
}

SketchItem.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  sketchItems: state.sketch.list
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  sketchResetItems: () => dispatch(sketchResetItems())
})

export default connect(mapStateToProps, mapDispatchToProps)(SketchItem)