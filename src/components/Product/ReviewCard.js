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
import ReviewComment from './ReviewComment';
import NameAvatarButton from '../common/NameAvatarButton';
import RawNameAvatar from '../common/RawNameAvatar';

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

const ReviewCard = ({authStore, width, review, reload}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState(null)
  const [content, setContent] = useState(null)
  const [editReview, setEditReview] = useState(false)
  const [recentComment, setRecentComment] = useState(null)
  const cardSizeLookup = {
    xs: 1,
    sm: 1,
    md: 1/2,
    lg: 1/2,
    xl: 1/2,
  }
  const createdAt = new Date(review.createdAt)
  const updatedAt = new Date(review.updatedAt)

  useEffect(() => {
    if(editReview){
      setContent(
        <form id="content-edit-form" onSubmit={handleSubmit(submitReviewEdit)}>
          <TextField
          required
          fullWidth
          inputRef={register({})}
          defaultValue={review.content}
          variant="outlined"
          margin="normal"
          name="editedContent"
          label="내용" />
          <Box flexGrow={1} display="flex" justifyContent="flex-end" alignItems="center">
            <Tooltip title="수정 취소">
              <IconButton onClick={() => setEditReview(false)}>
                <Clear />
              </IconButton>
            </Tooltip>
            <Tooltip title="적용">
              <IconButton type="submit" form="content-edit-form" >
                <Done />
              </IconButton>
            </Tooltip>
          </Box>
        </form>
      )
    }
    else(
      setContent(
        review.content.split('\n').map((i, key) => {
          return <Typography key={key} paragraph variant="body1">{i}</Typography>;
        })
      )
    )
  }, [editReview, review.content])

  useEffect(() => {
    if(comments === null) fetchComments()
  }, [comments])

  const fetchComments = () => {
    fetch(sangminserver+"/review/"+review.id,{
      credentials: 'include',
    })
    .then(
      response => response.json(),
      error => console.error(error)
    )
    .then((json) => {
      setComments(json.comments.map((comment) => {
        return(
          <ReviewComment comment={comment} reload={() => fetchComments()} />
        )
      }))
      const recent = json.comments.reverse()[0]
      if(recent !== undefined) setRecentComment(
        <Box display="flex" flexDirection="row" alignItems="center">
        <NameAvatarButton name={recent.writer} userId={recent.userId} size={4} />
          <Box p={1} flexGrow={1}>
            <Typography item gutterBottom>
              {recent.content.length>50?recent.content.substring(0,50) + "...":recent.content}
            </Typography>
          </Box>
        </Box>
      )
      else setRecentComment(null)
    })
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const submitComment = (data) => {
    fetch(sangminserver+"/review/comment/"+review.id,{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        'Cache': 'no-cache'
      },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.error(error)
    )
    .then((text) => {
        if(text === "OK"){
            enqueueSnackbar("댓글을 작성했습니다.",{"variant": "success"});
            fetchComments()
        }
        else{
            enqueueSnackbar("댓글 작성에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
        }
    })
  }
  const submitReviewEdit = (data) => {
    if(data.editedContent !== review.content){
      fetch(sangminserver+"/review/updateReview/",{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify({
          reviewId: review.id,
          comment: data.editedContent
        }),
        credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === 'update review complete'){
          enqueueSnackbar("리뷰를 수정했어요",{"variant": "success"});
          reload()
        }
        else if(text === 'update review fail'){
          enqueueSnackbar("수정할 권한이 없어요",{"variant": "error"});
        }
        else{
          enqueueSnackbar("리뷰 수정에 실패했어요. 오류가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
      })
    }
    setEditReview(false)
  }
  const commentWriteComponent = (
    <form onSubmit={handleSubmit(submitComment)}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <RawNameAvatar name={authStore.currentUser} size={4} />
        <Box flexGrow={1} p={1}>
          <TextField 
            inputRef={register({required: true})}
            required
            multiline
            name="content"
            label="댓글 작성"
            fullWidth 
            variant="outlined" 
          />
        </Box>
        <Button
          type="submit"
          color="inherit"
          variant="outlined">💬댓글쓰기</Button>
      </Box>
    </form>
  )
  const deleteReview = () => {
    fetch(sangminserver+"/review/deleteReview/",{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        'Cache': 'no-cache'
      },
      body: JSON.stringify({
        reviewId: review.id
      }),
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.error(error)
    )
    .then((text) => {
        if(text === 'delete review done'){
          enqueueSnackbar("리뷰를 삭제했어요",{"variant": "success"});
          reload()
        }
        else if(text === 'delete review fail'){
          enqueueSnackbar("삭제할 권한이 없어요",{"variant": "error"});
        }
        else{
          enqueueSnackbar("리뷰 삭제에 실패했어요. 오류가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
    })
  }

  return (
    <Box p={1} container={Card} item width={cardSizeLookup[width]} className={classes.card} variant="outlined">
      
      <Grid item container>
        <NameAvatarButton name={review.user_email} userId={review.userId} />
        <Box item direction="column" flexGrow={1}>
          <Typography>{review.user_email}</Typography>
          <Typography variant="body2" color="textSecondary">
            {updatedAt.getTime()>createdAt.getTime()?updatedAt.toLocaleString()+" (수정됨)" : createdAt.toLocaleString()}
          </Typography>
        </Box>
        <Box item>
          {review.userId === authStore.currentId?(
            editReview?(
              <React.Fragment>
                <Tooltip title="수정 취소">
                  <IconButton onClick={() => setEditReview(false)}>
                    <Clear />
                  </IconButton>
                </Tooltip>
                <Tooltip title="적용">
                  <IconButton type="submit" form="content-edit-form" >
                    <Done />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            ): (
              <React.Fragment>
                <Tooltip title="수정">
                  <IconButton onClick={() => setEditReview(true)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="삭제">
                  <IconButton onClick={deleteReview}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )
          )
          :null}
        </Box>
      </Grid>
      {review.img?<ButtonBase>
        <Avatar 
          src={review.img} 
          className={classes.cardMedia}
          variant="rounded"
        />
      </ButtonBase>:null}
      <CardContent>
        {content}
      </CardContent>
      <CardActions>
        <Box flexGrow={1}>
          {recentComment}
        </Box>
        <Button
          className={clsx({
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
        >
          💬댓글 {comments?comments.length:0}개
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box p={1} component={Paper}>
          {commentWriteComponent}
          <Box>
            {comments}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

ReviewCard.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(ReviewCard))