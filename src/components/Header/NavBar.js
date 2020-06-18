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
  Popover,
  Divider,
  Fab,
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
import RawNameAvatar from '../common/RawNameAvatar';

const useStyles = makeStyles((theme) => ({
  topbar: {
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  logo: {
    width: theme.spacing(30),
    height: 'auto',
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
}));

const NavBar = ({menus, authStore, sketchOpened, handleDrawer, requestLogout, push }) => {
  const classes = useStyles();
  const [ adminMenu, setAdminMenu ] = useState(null)
  const [designMenu, setDesignMenu] = useState(null)
  const [popoverTarget, setPopoverTarget] = useState(null)
  const open = Boolean(popoverTarget);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    // console.log(authStore.shopAdmin)
    if(authStore.session === "shopadmin"){
      setAdminMenu(
        <Link onClick={() => {push("/shop/")}} color="primary" >📈쇼핑몰 관리 페이지</Link>
      )
    }
    else if(authStore.session === "admin"){
      setAdminMenu(
        <Link onClick={() => {push("/admin/")}} color="primary" >📈플랫폼 관리 페이지</Link>
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
    closePopover()
    push("/")
  }
  const closePopover = () => {
    setPopoverTarget(null)
  }
  const pushTo = (url) => {
    push(url)
    closePopover()
  }

  return(
    <React.Fragment>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar className={classes.topbar} alignItems="center">
          <ButtonBase component={RouterLink} to="/">
            <Avatar src={Logo} className={classes.logo} variant="square" />
          </ButtonBase>
          <ProductSearchBar />
          <Box display="flex" flexShrink={1}>
            {designMenu}
            <IconButton onClick={(event) => setPopoverTarget(event.target)}>
              <RawNameAvatar name={authStore.currentUser} />
            </IconButton>
          </Box>
        </Toolbar>
        <Toolbar component="nav" variant="dense" className={classes.toolbar}>
          {menus.map(({component, path}) => (
              <Link onClick={() => push(path)}
              color="inherit"
              noWrap
              variant="body2"
              className={classes.toolbarLink}>{component}</Link>
          ))}
        </Toolbar>
      </AppBar>
      <Popover
      id={id}
      open={open}
      anchorEl={popoverTarget}
      onClose={() => closePopover()}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      transformOrigin={{vertical: 'top', horizontal: 'right'}}>
        <Box p={1} display="flex" flexDirection="column">
          <Box display="flex" flexDirection="column" px={10} py={3} alignItems="center" justifyContent="center">
            <RawNameAvatar name={authStore.currentUser} size={10} />
            <Link onClick={() => pushTo("/mypage/"+authStore.currentId)} color="inherit" >{authStore.currentUser}</Link>
          </Box>
          <Divider />
          <Box display="flex" flexDirection="column" p={1}>
            <Link onClick={() => pushTo("/mypage/"+authStore.currentId+"?design")} color="inherit" >💎추천코디 공유글</Link>
            <Link onClick={() => pushTo("/mypage/"+authStore.currentId+"?community")} color="inherit" >👀커뮤니티 게시글</Link>
            <Link onClick={() => pushTo("/message/"+authStore.currentId)} color="inherit" >📬쪽지함</Link>
            <Link onClick={() => pushTo("/closet/"+authStore.currentId)} color="inherit" >✨나의옷장</Link>
          </Box>
          <Divider />
          <Box display="flex" flexDirection="column" p={1}>
            <Link onClick={() => pushTo("/order/cart")} color="inherit" >🛒장바구니</Link>
            <Link onClick={() => pushTo("/order/myorder")} color="inherit" >🚀배송조회</Link>
            {adminMenu}
          </Box>
          <Divider />
          <Box display="flex" flexDirection="column" p={1}>
            <Link onClick={handleLogout} color="inherit" >🔓로그아웃</Link>
          </Box>
        </Box>
      </Popover>
    </React.Fragment>
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