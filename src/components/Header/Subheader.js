import React from 'react'
import PropTypes from 'prop-types'
import { fade, makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Box,
  AppBar, Toolbar, IconButton, Link, Typography,
  Button,
  Divider,
} from '@material-ui/core'
import { Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon
} from '@material-ui/icons'
import { requestLogout } from '../../actions/auth'
import { handleDrawer } from '../../actions/sketch';
import {yujinserver} from '../../restfulapi'

const useStyles = makeStyles((theme) => ({
  toolbarSecondary: {
    justifyContent: 'space-around',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}));

const Subheader = ({name, menus, additionalButton}) => {
  const classes = useStyles();


  return(
    <AppBar position="relative" color="secondary" elevation={0}>
      <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
        {name !== undefined?<>
          <Typography>{name}</Typography>
          <Divider orientation="vertical" flexItem />
        </>:null}
        {menus.map(({component, path}) => (
            <Link component={RouterLink} to={path}
            color="inherit"
            noWrap
            variant="body2"
            className={classes.toolbarLink}>{component}</Link>
        ))}
        {additionalButton?additionalButton:null}
      </Toolbar>
    </AppBar>
  )
}

Subheader.propTypes = {
  menus: PropTypes.array,
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Subheader)