// "/message"에서 확인하는 장바구니페이지
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Typography, Divider, Paper, ButtonBase, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Tooltip,
} from '@material-ui/core'
import MypageSubheader from '../Mypage/MypageSubheader';
import { yujinserver } from '../../restfulapi';
import NameAvatarButton from '../common/NameAvatarButton';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { Sync, Close } from '@material-ui/icons';
import queryString from 'query-string'
import { push } from 'connected-react-router';

const useStyles = makeStyles((theme) => ({
  // textfield: {
  //   flexGrow: 1,
  // }
  dialog: {
    height: '70vh'
  },
  body: {
    overflowY: "auto",
    // height: 0,
  },
  themeColor: {
    backgroundColor: theme.palette.secondary.light,
    color: 'rgb(255,255,255)'
  }
}));

const EmptyMessageRoom = ({actor, target, reload, search, push}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [textline, setTextline] = useState("")
  const [fetching, setFetching] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(parseInt(queryString.parse(search).to) === target.id)
  }, [search])
  const handleClose = () => {
    push('/mypage/'+actor+"?page=message")
  }

  const sendMessage = (event) => {
    event.preventDefault()
    if(!fetching){
      setFetching(true)
      fetch(yujinserver+"/message/"+target.id,{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify({
          line: textline,
        }),
        credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === "쪽지보내기 성공!"){
          // enqueueSnackbar("성공이요",{"variant": "success"});
          reload()
          setTextline("")
        }
        else if(text === "삭제된유저"){
          enqueueSnackbar("존재하지 않거나 탈퇴한 회원입니다.",{"variant": "error"});
          handleClose()
        }
        else{
          enqueueSnackbar("쪽지보내기에 실패했습니다. 에러가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
        setFetching(false)
      })
    }
  }

  return(
    <Dialog 
    fullWidth
    maxWidth="sm"
    open={open}
    onClose={handleClose}
    aria-labelledby="design-write-dialog"
    >
      <Box flexGrow={1} className={classes.dialog} p={1} display="flex" flexDirection="column">
        <Box flexShrink={0} display="flex" flexDirection="column">
          <Box pb={1} pl={2} display="flex" flexDirection="row" alignItems="center">
            <Typography><strong>{target.name}</strong>님과의 쪽지</Typography>
            <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
              <Tooltip title="새로고침">
                <IconButton onClick={() => reload()}>
                  <Sync />
                </IconButton>
              </Tooltip>
              <Tooltip title="닫기">
                <IconButton onClick={() => handleClose()}>
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Divider />
        </Box>
        <Box flexGrow={1} className={classes.body} display="flex" flexDirection="column">
        </Box>
        <form onSubmit={(event) => sendMessage(event)}>
          <Box flexShrink={0} display="flex" flexDirection="row" alignItems="center">
            <TextField
            value={textline}
            onChange={(event) => setTextline(event.target.value)}
            variant="outlined"
            margin="normal"
            required
            id="line"
            name="line"
            label="내용"
            autoFocus
            // className={classes.textfield}
            component={Box} flexGrow={1}
            />
            <Button disabled={fetching} type="submit">전송</Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  )
}

EmptyMessageRoom.propTypes = {
  //pathname: PropTypes.string,
  // search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  //pathname: state.router.location.pathname,
  search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmptyMessageRoom)
