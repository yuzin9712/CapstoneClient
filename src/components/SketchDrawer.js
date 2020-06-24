// https://material-ui.com/components/drawers/
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Box,
  SwipeableDrawer,
  Button,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Container,
  Drawer,
  Dialog,
  Tooltip,
  Typography,
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MoveToInbox as InboxIcon,
  Mail as MailIcon,
  Close,
  Help,
} from '@material-ui/icons'
import SketchComponent from './Sketch/SketchComponent'
import SketchGuide from './Sketch/SketchGuide'
import { handleDrawerClose } from '../actions/sketch'

const useStyles = makeStyles((theme) => ({
  transition: {
    transition: "all 0.2s ease-in-out",
  },
  opened: {
    flexGrow: 1,
  },
}));

const SketchDrawer = function({drawerOpen}){
  const theme = useTheme();
  const classes = useStyles();

  return(
    // <Box className={clsx({
    //   [classes.root]: true,
    //   [classes.closed]: !drawerOpen
    // })}>
    //   <Container maxWidth="sm" fixed>
    //     <SketchComponent />
    //     {/* <Scatch /> */}
    //   </Container>
    // </Box>
    <>
      <Box flexGrow={0} className={clsx({
        [classes.transition]: true,
        [classes.opened]: drawerOpen,
      })} />
      <Drawer
      open={drawerOpen}
      anchor='right'
      variant="persistent">
        <SketchComponent />
      </Drawer>
    </>
  )
}

SketchDrawer.propTypes = {
  drawerOpen: PropTypes.bool,
}

const mapStateToProps = state => ({
  drawerOpen: state.sketch.opened,
  // pathname: state.router.location.pathname,
  // search: state.router.location.search,
})

const mapDispatchToProps = dispatch => ({
  handleDrawerClose: () => dispatch(handleDrawerClose()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SketchDrawer)