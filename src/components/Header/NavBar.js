import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { fade, makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Box,
  AppBar, Toolbar, IconButton, Link, Typography,
  Button,
  TextField,
  InputAdornment,
  ButtonBase,
  Avatar,
} from '@material-ui/core'
import { Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Palette,
  ChevronLeft
} from '@material-ui/icons'
import { requestLogout } from '../../actions/auth'
import { handleDrawer } from '../../actions/sketch';
import {yujinserver} from '../../restfulapi'
import { push } from 'connected-react-router';
import ProductSearchBar from '../Product/ProductSearchBar';
import Logo from '../../../public/logo.png'

const useStyles = makeStyles((theme) => ({
  topbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between'
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.primary.light
  },
  logo: {
    width: theme.spacing(30),
    height: 'auto',
  },
  toolbarSecondary: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  actionBox: {
    '& > *': {
      padding: theme.spacing(1)
    }
  }
}));

const NavBar = ({menus, authStore, sketchOpened, handleDrawer, requestLogout, push }) => {
  const classes = useStyles();
  const [ adminMenu, setAdminMenu ] = useState(null)
  const [designMenu, setDesignMenu] = useState(null)

  useEffect(() => {
    // console.log(authStore.shopAdmin)
    if(authStore.session === "shopadmin"){
      setAdminMenu(
        <Link onClick={() => {push("/shop/")}} color="primary" >{authStore.currentUser}관리자페이지</Link>
      )
    }
    else if(authStore.session === "admin"){
      setAdminMenu(
        <Link onClick={() => {push("/admin/")}} color="primary" >플랫폼관리자페이지</Link>
      )
    }
    else {
      setAdminMenu(null)
    }
  }, [authStore.session])

  useEffect(() => {
    if(sketchOpened){
      setDesignMenu(
        <Button variant="outlined" size="small" onClick={() => handleDrawer()}>
          <ChevronLeft />닫기
        </Button>
      )
    }
    else{
      setDesignMenu(
        <Button variant="contained" color="primary" size="small" onClick={() => handleDrawer()}>
          <Palette />코디하기
        </Button>
      )
    }
  }, [sketchOpened])

  const handleLogout = () => {
    requestLogout()
    push("/")
  }

  return(
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Box className={classes.topbar} alignItems="center">
        <Box className={classes.actionBox}>
        <Link onClick={handleLogout} color="inherit" >로그아웃</Link>
        <Link onClick={() => push("/order/cart")} color="inherit" >장바구니</Link>
        <Link onClick={() => {push("/order/myorder")}} color="inherit" >마이페이지</Link>
        {adminMenu}
        </Box>
        <Box display="flex" flexDirection="row">
          <ProductSearchBar />
          {designMenu}
        </Box>
      </Box>
      <Toolbar className={classes.toolbar}>  
        <ButtonBase component={RouterLink} to="/">
          <Avatar src={Logo} className={classes.logo} variant="square" />
        </ButtonBase>
      </Toolbar>
      <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
            {menus.map(({component, path}) => (
                <Link component={RouterLink} to={path}
                color="inherit"
                noWrap
                variant="body2"
                className={classes.toolbarLink}>{component}</Link>
            ))}
        
        </Toolbar>
    </AppBar>
  )
}

NavBar.propTypes = {
  menus: PropTypes.array,
}

const mapStateToProps = state => ({
  sketchOpened: state.sketch.opened,
  authStore: state.auth,
})

const mapDispatchToProps = dispatch => ({
  handleDrawer: () => dispatch(handleDrawer()),
  requestLogout: () => dispatch(requestLogout()),
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)