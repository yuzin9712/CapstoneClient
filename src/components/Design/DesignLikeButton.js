// 팔로우 여부에 따라 팔로우할지 언팔로우할지 보여주는 그 버튼~
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Tooltip, IconButton, Box, Typography,
} from '@material-ui/core'
import {
    Person as PersonIcon,
    PersonAdd as FollowIcon,
    PersonAddDisabled as UnfollowIcon,
    HowToReg,
    FavoriteBorder,
    Favorite,
  } from '@material-ui/icons'
import { useSnackbar } from 'notistack';
import { requestDesignLikes, requestDesignLikesCancel } from '../../actions/design';

const useStyles = makeStyles((theme) => ({
  likes: {
    color: 'red',
  },
}));

const FollowButton = ({target, count = 0, sessionId, designStore, requestDesignLikes, requestDesignLikesCancel, }) => {
  const classes = useStyles();
  const initialLikes = useMemo(() => (designStore.likeDesign.some((userId) => (userId === target))), [])
  const [likes, setLikes] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const handleLikes = () => {
    if(likes){
      requestDesignLikesCancel(target)
      .then(() => {
        if(designStore.fetching === "FAILURE"){
          enqueueSnackbar("좋아요 철회 실패. 문제가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
        else if(designStore.fetching === "SUCCESS"){
          setLikes(false)
        }
      })
    }
    else{
      requestDesignLikes(target)
      .then(() => {
        if(designStore.fetching === "FAILURE"){
          enqueueSnackbar("좋아요 처리에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
        }
        else if(designStore.fetching === "SUCCESS"){
          setLikes(true)
        }
      })
    }
  }

  useEffect(() => {
    if(designStore.fetching === "SUCCESS") {
      if(designStore.likeDesign.some((userId) => (userId === target))){
        // enqueueSnackbar(design.user.name+"님을 팔로우했어요.",{"variant": "success"});
        setLikes(true)
      }
      else{
        // enqueueSnackbar(design.user.name+"님을 언팔로우했어요.",{"variant": "success"});
        setLikes(false)
      }
    }
  }, [designStore])

  return(
    <Tooltip 
      placement="top" 
      title={likes?"좋아요 취소":"좋아요"}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <IconButton 
        aria-label="likes" 
        centerRipple 
        onClick={handleLikes}>
          {likes?<Favorite className={classes.likes}/>:<FavoriteBorder />}
        </IconButton>
        <Typography>{(count)+(initialLikes?(likes?(0):(-1)):(likes?(1):(0)))}</Typography>
      </Box>
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
  designStore: state.design,
})

const mapDispatchToProps = (dispatch) => ({
  requestDesignLikes: (designId) => dispatch(requestDesignLikes(designId)),
  requestDesignLikesCancel: (designId) => dispatch(requestDesignLikesCancel(designId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton)
