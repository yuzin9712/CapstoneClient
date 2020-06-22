// 팔로우 여부에 따라 팔로우할지 언팔로우할지 보여주는 그 버튼~
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Tooltip, IconButton,
} from '@material-ui/core'
import {
    Person as PersonIcon,
    PersonAdd as FollowIcon,
    PersonAddDisabled as UnfollowIcon,
    HowToReg,
  } from '@material-ui/icons'
import { requestFollow, requestUnfollow } from '../../actions/follow';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    follow: {
      color: theme.palette.info.main,
    },
    unfollow: {
      color: theme.palette.error.main,
    }
}));

const FollowButton = ({targetuserid, sessionId, followStore, requestFollow, requestUnfollow, }) => {
  const classes = useStyles();
  const [follows, setFollows] = useState(false)
  const [hover, setHover] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const handleFollowHover = () => {
    setHover(true)
  }
  const handleFollowUnhover = () => {
    setHover(false)
  }
  const handleFollow = () => {
    if(follows){
      requestUnfollow(targetuserid)
      .then(() => {
        if(followStore.fetching === "FAILURE"){
          enqueueSnackbar("팔로우처리 실패",{"variant": "error"});
        }
        else if(followStore.fetching === "SUCCESS"){
          enqueueSnackbar("언팔로우했어요.🖐",{"variant": "success"});
          setFollows(false)
        }
      })
    }
    else{
      requestFollow(targetuserid)
      .then(() => {
        if(followStore.fetching === "FAILURE"){
          enqueueSnackbar("팔로우처리 실패",{"variant": "error"});
        }
        else if(followStore.fetching === "SUCCESS"){
          enqueueSnackbar("팔로우했어요.🤝",{"variant": "success"});
          setFollows(true)
        }
      })
    }
  }

  useEffect(() => {
    if(followStore.fetching === "SUCCESS") {
      if(followStore.follow.some((userId) => (userId === targetuserid))){
        // enqueueSnackbar(design.user.name+"님을 팔로우했어요.",{"variant": "success"});
        setFollows(true)
      }
      else{
        // enqueueSnackbar(design.user.name+"님을 언팔로우했어요.",{"variant": "success"});
        setFollows(false)
      }
    }
  }, [followStore])

  if(targetuserid === sessionId) return null
  else return(
    <Tooltip 
      placement="top" 
      title={follows?"언팔로우":"팔로우"}
    >
      <IconButton 
        aria-label="follow" 
        centerRipple 
        onClick={handleFollow}
        onMouseEnter={handleFollowHover}
        onMouseLeave={handleFollowUnhover}>
        {follows? (hover?
          <UnfollowIcon className={classes.unfollow} />
        : <HowToReg className={classes.follow} />
        )
        : (hover?
          <FollowIcon />
        : <PersonIcon />)}
    </IconButton>
    </Tooltip>
  )
}

FollowButton.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}

const mapStateToProps = state => ({
  sessionId: state.auth.currentId,
  followStore: state.follow,
})

const mapDispatchToProps = (dispatch) => ({
  requestFollow: (userId) => dispatch(requestFollow(userId)),
  requestUnfollow: (userId) => dispatch(requestUnfollow(userId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton)
