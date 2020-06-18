// "/message"에서 확인하는 장바구니페이지
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Typography, Divider, Paper, ButtonBase, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Tooltip,
} from '@material-ui/core'
import NameAvatarButton from '../common/NameAvatarButton';
import MessageRoom from './MessageRoom';
import { push } from 'connected-react-router';


const MessageCard = ({room, reload, authStore, push}) => {
  // const [open, setOpen] = useState(false)
  const lastMessage = room.chatLines[0]
  const counter = authStore.currentId === room.user1Id? ({id: room.user2Id, name: room.user2}) : ({id: room.user1Id, name: room.user1})

  return(
    <React.Fragment>
      <Box width={1} m={1} flexGrow={1} display="flex" flexDirection="row" component={Paper}>
        <Box>
          <NameAvatarButton name={counter.name} userId={counter.id} />
        </Box>
        <ButtonBase onClick={() => push('/message/'+authStore.currentId+'?to='+counter.id)} component={Box} p={1} flexGrow={1} display="flex" flexDirection="column">
          <Box flexGrow={1} display="flex" flexDirection="row" alignItems="center">
            <Typography component={Box} flexGrow={1}><strong>{counter.name}</strong>님과의 쪽지</Typography>
            <Typography variant="body2">{new Date(lastMessage.createdAt).toLocaleString()}</Typography>
          </Box>
          <Typography>{lastMessage.lines}</Typography>
        </ButtonBase>
      </Box>
      <MessageRoom counter={counter} handleClose={() => push('/message/'+authStore.currentId)} room={room} reload={reload} />
    </React.Fragment>
  )
}

MessageCard.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  authStore: state.auth,
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageCard)
