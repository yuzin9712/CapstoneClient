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
import { Sync } from '@material-ui/icons';
import queryString from 'query-string'

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

const MessageRoom = ({counter, handleClose, room, reload, search}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [textline, setTextline] = useState("")
  const [fetching, setFetching] = useState(false)
  const [open, setOpen] = useState(false)
  const topScroll = useRef(null)
  useEffect(() => {
    setOpen(parseInt(queryString.parse(search).to) === counter.id)
  }, [search])

  const sendMessage = (event) => {
    event.preventDefault()
    if(!fetching){
      setFetching(true)
      fetch(yujinserver+"/message/"+counter.id,{
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
        error => console.log(error)
      )
      .then((text) => {
        if(text === "쪽지보내기 성공!"){
          // enqueueSnackbar("성공이요",{"variant": "success"});
          reload()
          setTextline("")
          topScroll.current.scrollIntoView({ behavior: "smooth" })
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
          <Box px={3} display="flex" flexDirection="row" alignItems="center">
            <Typography component={Box} flexGrow={1}><strong>{counter.name}</strong>님과의 쪽지</Typography>
            <Tooltip title="새로고침">
              <IconButton onClick={() => {
                reload()
                topScroll.current.scrollIntoView({ behavior: "smooth" })
              }}>
                <Sync />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider />
        </Box>
        <Box flexGrow={1} className={classes.body} display="flex" flexDirection="column">
          <Grid container component={Box} p={1}>
            <div ref={topScroll} ></div>
            {room !== undefined? room.chatLines.map((line) => {
              const createdAt = new Date(line.createdAt)
              if(line.user.id === counter.id) return( // 상대 쪽지
                <Box width={1} py={1} flexGrow={1} display="flex" flexDirection="row" alignItems="flex-end">
                  <Box alignSelf="flex-start">
                    <NameAvatarButton name={counter.name} userId={counter.id} />
                  </Box>
                  <Box p={1} display="flex" flexDirection="column">
                    <Typography>{counter.name}</Typography>
                    <Box p={1} flexGrow={1} display="flex" flexDirection="column" component={Paper}>
                      {line.lines.split('\n').map((i, key) => {
                        return <Typography key={key} variant="body1">{i}</Typography>;
                      })}
                    </Box>
                  </Box>
                  <Box px={1} display="flex" flexDirection="column">
                    <Typography variant="body2">{createdAt.toLocaleDateString()}</Typography>
                    <Typography variant="body2">{createdAt.toLocaleTimeString()}</Typography>
                  </Box>
                  <Box flexGrow={1} />
                </Box>
              )
              else return( // 내가보낸 쪽지
                <Box width={1} py={1} flexGrow={1} display="flex" flexDirection="row-reverse" alignItems="flex-end" >
                  <Box p={1} display="flex" flexDirection="column" component={Paper} className={classes.themeColor}>
                    {line.lines.split('\n').map((i, key) => {
                      return <Typography key={key} variant="body1">{i}</Typography>;
                    })}
                  </Box>
                  <Box px={1} display="flex" flexDirection="column" alignItems="flex-end">
                    <Typography variant="body2">{createdAt.toLocaleDateString()}</Typography>
                    <Typography variant="body2">{createdAt.toLocaleTimeString()}</Typography>
                  </Box>
                  <Box flexGrow={1} />
                </Box>
              )
            })
            :null}
          </Grid>
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

MessageRoom.propTypes = {
  //pathname: PropTypes.string,
  // search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  // authStore: state.auth,
  //pathname: state.router.location.pathname,
  search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageRoom)
