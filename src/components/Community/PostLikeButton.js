// 팔로우 여부에 따라 팔로우할지 언팔로우할지 보여주는 그 버튼~
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Tooltip, IconButton, Typography, Box,
} from '@material-ui/core'
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  } from '@material-ui/icons'
import { useSnackbar } from 'notistack';
import { requestPostLikes, requestPostLikesCancel } from '../../actions/postlike';

const useStyles = makeStyles((theme) => ({
  likes: {
    color: 'red',
  },
}));

const PostLikeButton = ({targetpostid, initialLike, postlikeStore, requestPostLikes, requestPostLikesCancel, }) => {
  const classes = useStyles();
  const [likes, setLikes] = useState(postlikeStore.likePost.some((postId) => (postId === targetpostid)))
  const [likecount, setLikecount] = useState(initialLike)
  const { enqueueSnackbar } = useSnackbar();

  const handleLikes = () => {
    if(likes){
      requestPostLikesCancel(targetpostid)
    }
    else{
      requestPostLikes(targetpostid)
    }
  }

  useEffect(() => {
    if(postlikeStore.fetching !== "FAILURE"){
      if(postlikeStore.likePost.some((postId) => (postId === targetpostid))){
        if(!likes){
          setLikecount(likecount+1)
          setLikes(true)
        }
      }
      else if(likes){
        setLikecount(likecount-1)
        setLikes(false)
      }
    }
    else{
      enqueueSnackbar("좋아요 처리에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
    }
  }, [postlikeStore])

  return(
    <Box display="flex" flexDirection="row" alignItems="center">
      <Tooltip placement="top" title={likes?"좋아요 취소":"좋아요"}>
        <IconButton aria-label="like" onClick={handleLikes}>
          {likes?<FavoriteIcon className={classes.likes}/>:<FavoriteBorderIcon />}
        </IconButton>
      </Tooltip>
      <Typography>{likecount}</Typography>
    </Box>
  )
}

PostLikeButton.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}

const mapStateToProps = state => ({
  postlikeStore: state.post,
})

const mapDispatchToProps = (dispatch) => ({
  requestPostLikes: (userId) => dispatch(requestPostLikes(userId)),
  requestPostLikesCancel: (userId) => dispatch(requestPostLikesCancel(userId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostLikeButton)
