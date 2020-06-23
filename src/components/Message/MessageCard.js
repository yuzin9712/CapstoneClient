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
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'flex',
    width: '100%',
  },
}));

const MessageCard = ({actor, room, counter, reload, push}) => {
  const classes = useStyles();
  // const [open, setOpen] = useState(false)
  const lastMessage = [...room.chatLines].pop()
  const summary = lastMessage.lines.length>20? lastMessage.lines.slice(0,20)+"…":lastMessage.lines
  const timestamp = moment(lastMessage.createdAt).fromNow()

  return(
    <React.Fragment>
      <Box width={1} m={1} flexGrow={1} display="flex" flexDirection="row" component={Paper}>
        <Box>
          <NameAvatarButton name={counter.name} userId={counter.id} />
        </Box>
        <ButtonBase className={classes.button} onClick={() => push('/mypage/'+actor+'?page=message&to='+counter.id)}>
          <Box p={1} flexGrow={1} display="flex" flexDirection="column">
            <Box flexGrow={1} display="flex" flexDirection="row" alignItems="center">
              <Typography align="left" component={Box} flexGrow={1}><strong>{counter.name}</strong></Typography>
              <Typography align="right" variant="body2" color="textSecondary">{timestamp}</Typography>
            </Box>
            <Typography align="left" variant="body2">{summary}</Typography>
          </Box>
        </ButtonBase>
      </Box>
      <MessageRoom counter={counter} handleClose={() => push('/mypage/'+actor+'?page=message')} room={room} reload={reload} />
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
