import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter, push } from 'connected-react-router'
import routes from './routes'
import { connect } from 'react-redux'
//ci 연동 테스트
import NavBar from './components/Header/NavBar'
import SketchDrawer from './components/SketchDrawer'
import AuthPage from './components/Auth/AuthPage'
import { SnackbarProvider } from 'notistack'

import { CssBaseline, Grid, Container, Box, Button } from '@material-ui/core'
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles'
import { red, purple, teal, indigo } from '@material-ui/core/colors'
// import { handleDrawerOpen } from './actions/sketch'
import { 
  fetchLoginStatus,
  getLoginStatus } from './actions/auth'
import moment from 'moment'
//xtx12354
// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[400],
    },
    secondary: {
      main: teal[400],
    },
    warning: {
      main: red.A400,
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row nowrap',
    height: '100vh',
    alignItems: 'stretch',
    overflow: "hidden",
  },
  main: {
    display: 'flex',
    flex: "1 1 auto",
    flexDirection: "column"
  },
  context: {
    overflowY: "auto",
    height: 0,
  },
}));

const menus = [
  {component: "👔상의", path: `/productList/category/${1}`},
  {component: "👖하의", path: `/productList/category/${2}`},
  {component: "🎀패션잡화", path: `/productList/category/${3}`},
  {component: "🥾신발", path: `/productList/category/${4}`},
  {component: "💎추천코디", path: "/design"},
  {component: "👀패션케어커뮤니티", path: "/community"},
];

const App = ({ history, pathname, authStore, fetchLoginStatus, dispatchPush }) => {
  const classes = useStyles();
  useEffect(() => {
    while (authStore.fetching !== 'FETCHING'){
      fetchLoginStatus(authStore.currentId)
      break
    }
  }, [pathname])
  moment.locale('ko')

  return (
    <ConnectedRouter history={history} noInitialPop>
      <ThemeProvider theme={theme}>
        <Grid container className={classes.root}>
          <CssBaseline />
          <SnackbarProvider preventDuplicate anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
          { authStore.session !== "LOGOUT"?
            <React.Fragment key={authStore.currentId}>
              <Box p={1} component={Container} maxWidth="lg" className={classes.main}>
                <NavBar menus={menus} mode={authStore.session} />
                <Box px={5} my={1} flexGrow={1} className={classes.context} key={authStore.currentId}>
                  { routes }
                </Box>
              </Box>
              <SketchDrawer />
            </React.Fragment>
            : <AuthPage />
          }
          </SnackbarProvider>
        </Grid>
      </ThemeProvider>
    </ConnectedRouter>
  )
}

App.propTypes = {
  history: PropTypes.object,
}
const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  authStore: state.auth,
})

const mapDispatchToProps = dispatch => ({
  dispatchPush: (url) => dispatch(push(url)),
  fetchLoginStatus: (id) => dispatch(fetchLoginStatus(id)),
  getLoginStatus: () => dispatch(getLoginStatus())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
