// "/auth"페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { goBack, push } from 'connected-react-router'
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form'


import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Box,
  AppBar,
  Avatar,
  Tab,
  Typography,
  Link,
  Grid,
  TextField,
  Button,
  Paper
} from '@material-ui/core'
import {
  TabContext,
  TabList,
  TabPanel,
} from '@material-ui/lab'
import {
  LockOutlined
} from '@material-ui/icons'

import Cookies from 'js-cookie'

import { 
  requestLogin,
  fetchLoginStatus,
  getLoginStatus
 } from '../../actions/auth';
import { yujinserver } from '../../restfulapi';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(2)
  },
  text: {
    margin: theme.spacing(2),
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const AuthPage = ({authStore, dispatchBack, dispatchPush, requestLogin}) => {
  const [ tabValue, setTabValue ] = useState("1");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { register, control, handleSubmit } = useForm();

  // useEffect(() => {
  //   if(authStore.fetching === 'SUCCESS'){
  //     if(authStore.session) enqueueSnackbar("어서오세요 "+authStore.name+"님.",{"variant": "success"});
  //     else enqueueSnackbar("안전하게 로그아웃되었습니다.",{"variant": "success"});
  //   }
  //   else if(authStore.fetching === 'FAILURE'){
  //     console.log(authStore)
  //     enqueueSnackbar("에러요",{"variant": "error"});
  //   }
  // }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const loginSubmit = (event) => {
    event.preventDefault()
    // console.log(email, password)
    requestLogin(email, password)
  }

  const loginView =
    <form
      className={classes.form}
      onSubmit={loginSubmit}
    >
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        value={email}
        onChange={(e) => (setEmail(e.target.value))}
        label="Email Address"
        autoComplete="email"
        autoFocus />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        id="password"
        onChange={(e) => (setPassword(e.target.value))}
        autoComplete="current-password" />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        로그인
      </Button>
    </form>


  const registerSubmit = (data) => {
    console.log(data)
    fetch(yujinserver+"/auth/join",{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify(data),
        credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.log(error)
    )
    .then((text) => {
        if(text === "success"){
            enqueueSnackbar("성공이요",{"variant": "success"});
        }
        else{
            enqueueSnackbar("실패따리",{"variant": "error"});
        }
        console.log(text)
    })
  }
  const registerView = (
    <form
      className={classes.form}
      onSubmit={handleSubmit(registerSubmit)}
    >
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        name="email"
        label="이메일"
      />
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="name"
        name="name"
        label="이름"
      />
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="password"
        name="password"
        type="password"
        label="비밀번호"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        가입
      </Button>
    </form>
  )

  const shopRegisterSubmit = (data) => {
    console.log(data)
    fetch(yujinserver+"/auth/shop",{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify(data),
        credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.log(error)
    )
    .then((text) => {
        if(text === "success"){
            enqueueSnackbar("성공이요",{"variant": "success"});
        }
        else{
            enqueueSnackbar("실패따리",{"variant": "error"});
        }
        console.log(text)
    })
  }
  const shopRegisterView = (
    <form
      className={classes.form}
      onSubmit={handleSubmit(shopRegisterSubmit)}
    >
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="shopname"
        name="shopname"
        label="쇼핑몰이름"
        autoFocus
      />
      <TextField
        inputRef={register({})}
        variant="outlined"
        margin="normal"
        fullWidth
        id="shopurl"
        name="shopurl"
        label="쇼핑몰홈페이지"
      />
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        name="email"
        label="이메일"
      />
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="password"
        name="password"
        type="password"
        label="비밀번호"
      />
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        type="number"
        id="phone"
        name="phone"
        label="대표번호"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        가입
      </Button>
    </form>
  )


  return(
    <Container className={classes.root} maxWidth="xs">
      <Paper className={classes.paper}>
      <Typography className={classes.text} align="center" gutterBottom component="h1" variant="h5">
        멋쟁이마당
      </Typography>
      <Typography className={classes.text} align="center" gutterBottom variant="body2">
        👓멋쟁이들의 패션 라운지
      </Typography>
      <TabContext value={tabValue} >
        <TabList onChange={handleTabChange} variant="fullWidth" aria-label="simple tabs">
          <Tab label="로그인" value="1" />
          <Tab label="회원가입" value="2" />
          <Tab label="관리자임시" value="3" />
        </TabList>
        <TabPanel value="1">{loginView}</TabPanel>
        <TabPanel value="2">{registerView}</TabPanel>
        <TabPanel value="3">{shopRegisterView}</TabPanel>
      </TabContext>
      </Paper>
    </Container>
  )
}

AuthPage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    authStore: state.auth,
})

const mapDispatchToProps = (dispatch) => ({
    dispatchBack: () => dispatch(goBack()),
    dispatchPush: (url) => dispatch(push(url)),
    requestLogin: (email, password) => dispatch(requestLogin(email, password)),
    fetchLoginStatus: () => dispatch(fetchLoginStatus()),
    getLoginStatus: () => dispatch(getLoginStatus())
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage)
