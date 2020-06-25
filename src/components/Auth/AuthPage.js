// "/auth"페이지
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { goBack, push } from 'connected-react-router'
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form'
import kakaologo from '../../../public/kakao_login_medium_wide.png'


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
  Paper,
  Dialog,
  Divider,
  ButtonBase
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
  kakaoButton: {
    width: '100%',
    height: '100%',
  }
}));

const AuthPage = ({authStore, dispatchBack, dispatchPush, requestLogin}) => {
  const [ tabValue, setTabValue ] = useState("1");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const classes = useStyles();
  const [fetching, setFetching] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const { register, control, handleSubmit } = useForm();
  const [shopRegisterOpen, setShopRegisterOpen] = useState(false)
  useEffect(() => {
    if(authStore.fetching === 'FAILURE'){
      enqueueSnackbar("로그인에 실패했습니다: "+authStore.currentUser,{"variant": "error"});
    }
  }, [authStore])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const loginSubmit = (event) => {
    event.preventDefault()
    setFetching(true)
    requestLogin(email, password)
    .then(() => setFetching(false))
  }

  const loginView = useMemo(() => (
  <Box display="flex" flexDirection="column" alignItems="center">
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
        disabled={fetching}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          로그인
        </Button>
      </form>
      <ButtonBase>
        {fetching?
        <Avatar src={kakaologo} variant="square" className={classes.kakaoButton} />
        :<a href="http://www.softjs2.com/api/auth/kakao">
          <Avatar src={kakaologo} variant="square" className={classes.kakaoButton} />
        </a>}
      </ButtonBase>
    </Box>
  ), [fetching, email, password])


  const registerSubmit = (data) => {
    if(password !== data.password_confirm){
      enqueueSnackbar("비밀번호와 비밀번호 확인이 다릅니다. 확인해주세요.",{"variant": "error"});
    }
    else if(!fetching){
      setFetching(true)
      fetch(yujinserver+"/auth/join",{
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Cache': 'no-cache'
          },
          body: JSON.stringify({
            email: email,
            name: data.name,
            password: password,
          }),
          credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === "success"){
          enqueueSnackbar("회원가입에 성공했습니다! 로그인해주세요.",{"variant": "success"});
          setTabValue("1")
        }
        else{
          enqueueSnackbar("회원가입에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
        }
        setFetching(false)
      })
    }
  }
  const registerView = useMemo(() => (
    <form
      className={classes.form}
      onSubmit={handleSubmit(registerSubmit)}
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
      variant="outlined"
      margin="normal"
      required
      fullWidth
      label="비밀번호"
      type="password"
      id="password"
      onChange={(e) => (setPassword(e.target.value))}
      autoComplete="current-password" />
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="password_confirm"
        name="password_confirm"
        type="password"
        label="비밀번호 확인"
      />
      <Button
      disabled={fetching}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        가입
      </Button>
    </form>
  ), [fetching, email, password])

  const shopRegisterSubmit = (data) => {
    if(password !== data.password_confirm){
      enqueueSnackbar("비밀번호와 비밀번호 확인이 다릅니다. 확인해주세요.",{"variant": "error"});
    }
    else if(!fetching){
      setFetching(true)
      fetch(yujinserver+"/auth/shop",{
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Cache': 'no-cache'
          },
          body: JSON.stringify({
            shopname: data.shopname,
            shopurl: data.shopurl,
            email: email,
            password: password,
            phone: data.phone
          }),
          credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === "success"){
          enqueueSnackbar("제휴 신청에 성공했습니다! 제휴가 완료되면 그때부터 쇼핑몰 관리가 가능해집니다.",{"variant": "success"});
          setShopRegisterOpen(false)
        }
        else{
          enqueueSnackbar("제휴 신청에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
        }
        setFetching(false)
      })
    }
  }
  const shopRegisterView = useMemo(() => (
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
        required
        fullWidth
        id="shopurl"
        name="shopurl"
        label="쇼핑몰홈페이지"
      />
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
      label="비밀번호"
      type="password"
      id="password"
      onChange={(e) => (setPassword(e.target.value))}
      autoComplete="current-password" />
      <TextField
        inputRef={register({required: true})}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="password_confirm"
        name="password_confirm"
        type="password"
        label="비밀번호 확인"
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
      disabled={fetching}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        가입
      </Button>
    </form>
  ), [fetching, email, password])


  return(
    <Container className={classes.root} maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box py={2}>
          <Box p={1} component={Paper}>
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
              </TabList>
              <TabPanel value="1">{loginView}</TabPanel>
              <TabPanel value="2">{registerView}</TabPanel>
            </TabContext>
          </Box>
        </Box>
        <Button color="secondary" variant="contained" onClick={() => setShopRegisterOpen(true)}>쇼핑몰 제휴신청은 여기로</Button>
        <Dialog
        maxWidth="xs"
        open={shopRegisterOpen}
        onClose={() => setShopRegisterOpen(false)}
        >
          <Box p={1} display="flex" flexDirection="column">
            <Typography gutterBottom variant="h6">쇼핑몰 제휴신청</Typography>
            <Divider variant="middle" />
            <Typography>쇼핑몰 관리자 자격으로 회원가입합니다. 멋쟁이마당 운영자의 승인이 있기까지 로그인이 제한됩니다. 승인 상황은 이메일으로 안내됩니다.</Typography>
            <Box pt={1} />
            {shopRegisterView}
          </Box>
        </Dialog>
      </Box>
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
