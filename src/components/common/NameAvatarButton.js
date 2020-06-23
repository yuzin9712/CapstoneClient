
// 이름에 따라 Avatar 색깔넣고 1글자이니셜하는거
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Avatar, Box, makeStyles, Popover, ButtonBase, Divider, Link, Tooltip, IconButton, Typography, Button,
} from '@material-ui/core'
import FollowButton from './FollowButton';
import RawNameAvatar from './RawNameAvatar';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Mail, Chat } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
}));

const NameAvatarButton = ({authStore, name, userId, size = 5, push}) => {
  const classes = useStyles({name, size});
  const [popoverTarget, setPopoverTarget] = useState(null)
  const open = Boolean(popoverTarget);
  const id = open ? 'simple-popover' : undefined;
  
  const closePopover = () => {
    setPopoverTarget(null)
  }
  const pushTo = (url) => {
    push(url)
    closePopover()
  }
  const messageToUser = () => {
    push("/mypage/"+authStore.currentId+"?page=message&to="+userId, {target: name})
    closePopover()
  }

  return(
    <React.Fragment>
      <IconButton disabled={name === null} onClick={(event) => setPopoverTarget(event.target)}>
        <RawNameAvatar name={name !== null?name:"탈퇴한 유저"} size={size} />
      </IconButton>
      <Popover
      id={id}
      open={open}
      anchorEl={popoverTarget}
      onClose={() => closePopover()}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}>
          <Box display="flex" flexDirection="column" px={10} py={3} alignItems="center" justifyContent="center">
            <IconButton onClick={() => pushTo("/mypage/"+userId)} >
                  <RawNameAvatar name={name !== null?name:"탈퇴한 유저"} size={10} />
            </IconButton>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography variant="h6">{name !== null?name:"탈퇴한 유저"}</Typography>
              <FollowButton targetuserid={parseInt(userId)} />
            </Box>
            {authStore.currentId !== userId?(
              <Box alignItems="center">
                <Button onClick={() => messageToUser()}>
                  <Chat /> 쪽지보내기
                </Button>
              </Box>
            ) : null}
          </Box>
          <Divider />
          <Box display="flex" flexDirection="column" p={1}>
            <Link onClick={() => pushTo("/mypage/"+userId+"?design")} color="inherit" >💎추천코디 공유글</Link>
            <Link onClick={() => pushTo("/mypage/"+userId+"?community")} color="inherit" >👀커뮤니티 게시글</Link>
          </Box>
      </Popover>
    </React.Fragment>
  )
}

NameAvatarButton.propTypes = {
    // pathname: PropTypes.string.isRequired,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}

const mapStateToProps = state => ({
  authStore: state.auth,
  //pathname: state.router.location.pathname,
  // search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url, props) => dispatch(push(url, props))
})

export default connect(mapStateToProps, mapDispatchToProps)(NameAvatarButton)