import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import clsx from 'clsx'
import { 
  Box,
  Grid,
  Card, 
  CardHeader, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  CardActions,
  Collapse,
  Chip,
  Button, Typography, Avatar, IconButton, ThemeProvider, withWidth, TextField, Paper, Tooltip, ButtonBase 
} from '@material-ui/core';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  Delete,
  Edit,
  Cancel,
  Done,
  Clear,
} from '@material-ui/icons'
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { sangminserver } from '../../restfulapi';
import { useSnackbar } from 'notistack';
import FollowButton from '../common/FollowButton';
import NameAvatarButton from '../common/NameAvatarButton';
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  cardMedia: {
      width: '100%',
      height: '100%'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    backgroundColor: theme.palette.grey[300]
  },
  product: {
    display: "flex",
  },
  commentAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const ReviewComment = ({authStore, comment, reload}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [content, setContent] = useState(null)
  const [editComment, setEditComment] = useState(false)
  // const edited = Date.parse(comment.createdAt) < Date.parse(comment.updatedAt)

  useEffect(() => {
    if(editComment){
      setContent(
        <form id={"comment-"+comment.id+"-edit-form"} onSubmit={handleSubmit(submitCommentEdit)}>
          <TextField
          required
          fullWidth
          inputRef={register({})}
          defaultValue={comment.content}
          variant="outlined"
          margin="normal"
          name="editedContent"
          label="내용" />
        </form>
      )
    }
    else(
      setContent(
        <React.Fragment>
          <Typography gutterBottom display="inline">
            {comment.content} 
          </Typography>
          <Typography gutterBottom display="inline" variant="body2" color="textSecondary">
            {" ー "+(moment(comment.createdAt).fromNow())}
          </Typography>
        </React.Fragment>
      )
    )
  }, [editComment, comment.content])


  const submitCommentEdit = (data) => {
    if(data.editedContent !== comment.content){
      fetch(sangminserver+"/review/updateComment/",{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify({
          commentId: comment.id,
          comment: data.editedContent
        }),
        credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === 'update comment success'){
          enqueueSnackbar("댓글을 수정했어요",{"variant": "success"});
          reload()
        }
        else if(text === 'update comment fail'){
          enqueueSnackbar("수정할 권한이 없어요",{"variant": "error"});
        }
        else{
          enqueueSnackbar("댓글 수정에 실패했어요. 오류가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
      })
    }
    setEditComment(false)
  }
  const deleteComment = (commentId) => {
    fetch(sangminserver+"/review/deleteComment/",{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        'Cache': 'no-cache'
      },
      body: JSON.stringify({
        commentId: commentId
      }),
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.error(error)
    )
    .then((text) => {
        if(text === 'delete comment done'){
          enqueueSnackbar("댓글을 삭제했어요",{"variant": "success"});
          reload()
        }
        else if(text === 'delete comment fail'){
          enqueueSnackbar("삭제할 권한이 없어요",{"variant": "error"});
        }
        else{
          enqueueSnackbar("댓글 삭제에 실패했어요. 오류가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
    })
  }

  return (
    <Box p={1} display="flex" flexDirection="row" key={comment.id} alignItems="center">
      <NameAvatarButton name={comment.writer} userId={comment.userId} size={3} />
      <Box display="flex" flexDirection="row" p={1} mx={1} flexGrow={1} alignItems="center" component={Paper} variant="outlined">
        <Box flexGrow={1}>{content}</Box>
        {authStore.currentId === comment.userId?
        (editComment?(
          <React.Fragment>
            <Tooltip title="수정 취소">
              <IconButton onClick={() => setEditComment(false)}>
                <Clear />
              </IconButton>
            </Tooltip>
            <Tooltip title="적용">
              <IconButton type="submit" form={"comment-"+comment.id+"-edit-form"} >
                <Done />
              </IconButton>
            </Tooltip>
          </React.Fragment>
        ):(
          <React.Fragment>
            <Tooltip title="수정">
              <IconButton onClick={() => setEditComment(true)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="삭제">
              <IconButton onClick={() => deleteComment(comment.id)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </React.Fragment>
        ))
        :null}
      </Box>
    </Box>
  )
}

ReviewComment.propTypes = {
    // design: PropTypes.object,
}

const mapStateToProps = state => ({
  authStore: state.auth,
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  // dispatchPush: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewComment) 