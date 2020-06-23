// "/message"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Typography, Divider, Paper, ButtonBase, IconButton, Tooltip, Container, Button, TextField,
} from '@material-ui/core'
import MypageSubheader from '../Mypage/MypageSubheader';
import { yujinserver } from '../../restfulapi';
import NameAvatarButton from '../common/NameAvatarButton';
import MessageRoom from './MessageRoom';
import { Sync, Add, Clear } from '@material-ui/icons';
import MessageCard from './MessageCard';
import queryString from 'query-string'
import RawNameAvatar from '../common/RawNameAvatar';
import { push } from 'connected-react-router';
import EmptyMessageRoom from './EmptyMessageRoom';

const useStyles = makeStyles((theme) => ({
  dashed: {
    borderStyle: "dashed",
    borderWidth: "thick",
  }
}));

const MessagePage = ({actor, target, match, search, push}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [openedRooms, setOpenedRooms] = useState([])
  const [messageRoomCards, setMessageRoomCards] = useState([])
  const [newMessageButton, setNewMessageButton] = useState(null)
  const [newMessageRoom, setNewMessageRoom] = useState(null)

  useEffect(() => {
    if(loading){
      fetch(yujinserver+"/message", {credentials: "include"})
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then((messageRooms) => {
        setOpenedRooms(messageRooms)
        setLoading(false)
      })
    }
  }, [loading])
  useEffect(() => {
    setMessageRoomCards(openedRooms.map((messageRoom) => {
      const counter = actor.id === messageRoom.user1Id? ({id: messageRoom.user2Id, name: messageRoom.user2}) : ({id: messageRoom.user1Id, name: messageRoom.user1})
      return(
        <MessageCard actor={actor.id} counter={counter} key={counter.id} room={messageRoom} reload={() => setLoading(true)} />
      )
    }))
  }, [openedRooms])
  useEffect(() => {
    if(!edit) setNewMessageButton(
      <Box p={1} m={1} display="flex" flexDirection="row" justifyContent="center" alignItems="center" 
      component={Button} fullWidth variant="outlined" onClick={() => setEdit(true)} className={classes.dashed}>
        <Add /><Typography>새 쪽지</Typography>
      </Box>
    )
    else setNewMessageButton(
      <Box p={1} m={1} width={1} flexGrow={1} display="flex" flexDirection="column" alignItems="center" 
      component={Paper} className={classes.dashed}>
        <Box display="flex" flexDirection="row" width={1} flexGrow={1} alignItems="center">
          <Typography component={Box} px={1} flexGrow={1}>팔로우한 유저 목록</Typography>
          <Tooltip title="취소">
            <IconButton onClick={() => setEdit(false)}>
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
        <Grid container>
          {actor.Followings.map((member) => {
            return(
              <Box p={1} m={1} width={1} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center"
              component={Button} onClick={() => push("/mypage/"+actor.id+"?page=message&to="+member.id, {target: member.name})}>
                <RawNameAvatar name={member.name} />
                <Typography component={Box} px={1}>{member.name}</Typography>
              </Box>
            )
          })}
        </Grid>
      </Box>
    )
  }, [edit, actor])

  useEffect(() => { 
    if(!openedRooms.some((room) => (target.id === room.user1Id) || (target.id === room.user2Id))){
      // create new room
      setNewMessageRoom(
        <EmptyMessageRoom actor={actor.id} key={target.id} target={target} reload={() => setLoading(true)} />
      )
    }
    else{
      setNewMessageRoom(null)
    }
  }, [target, openedRooms])

  return(
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h5" component={Box} flexGrow={1}>쪽지함</Typography>
        <Tooltip title="새로고침">
          <IconButton onClick={() => setLoading(true)}>
            <Sync />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <Grid container>
        {newMessageButton}
        {newMessageRoom}
        {messageRoomCards}
      </Grid>
    </Container>
  )
}

MessagePage.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => {
  const id = parseInt(queryString.parse(state.router.location.search).to)
  const target = state.router.location.state !== undefined? ({
    name: state.router.location.state.target,
    id: id,
  }) : ({
    name: "user"+id,
    id: id,
  })
  return({
    //pathname: state.router.location.pathname,
    search: state.router.location.search,
    //hash: state.router.location.hash,
    target: target,
  })
}

const mapDispatchToProps = (dispatch) => ({
  push: (url, props) => dispatch(push(url, props))
})

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage)
