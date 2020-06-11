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
} from '@material-ui/icons'
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { sangminserver } from '../../restfulapi';
import { useSnackbar } from 'notistack';
import FollowButton from '../Community/FollowButton';

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

const ReviewCard = ({currentUser, width, review}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState(null)
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
    if(comments === null) fetchComments()
  }, [comments])

  const fetchComments = () => {
    fetch(sangminserver+"/review/"+review.id,{
      credentials: 'include',
    })
    .then(
      response => response.json(),
      error => console.log(error)
    )
    .then((json) => {
      // console.log(json.comments)
      setComments(json.comments.map((comment) => (
        <Box p={1} display="flex" flexDirection="row" key={comment.id}>
          <Avatar className={classes.commentAvatar}>
            {comment.writer}
          </Avatar>
          <Box flexDirection="column" p={1} mx={1} flexGrow={1} component={Paper} variant="outlined">
            <Typography item gutterBottom>{comment.content}</Typography>
          </Box>
          <Tooltip title="삭제">
            <IconButton>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )))
      const recent = json.comments.reverse()[0]
      if(recent !== undefined) setRecentComment(
        <Box display="flex" flexDirection="row">
          <Avatar className={classes.commentAvatar}>{recent.writer}</Avatar>
          <Box p={1} flexGrow={1}>
            <Typography item gutterBottom>
              {recent.content.length>50?recent.content.substring(0,50) + "...":recent.content}
            </Typography>
          </Box>
        </Box>
      )
    })
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const submitComment = (data) => {
    console.log(data)
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
      error => console.log(error)
    )
    .then((text) => {
        if(text === "OK"){
            enqueueSnackbar("성공이요",{"variant": "success"});
            fetchComments()
        }
        else{
            enqueueSnackbar("실패따리",{"variant": "error"});
        }
        console.log(text)
    })
  }
  const commentWriteComponent = (
    <form onSubmit={handleSubmit(submitComment)}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Avatar>{currentUser}</Avatar>
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

  return (
    <Box p={1} container={Card} item width={cardSizeLookup[width]} className={classes.card} variant="outlined">
      
      <Grid item container>
        <Avatar item>{review.user_email}</Avatar>
        <Box item direction="column" flexGrow={1}>
          <Typography>{review.user_email}</Typography>
          <Typography variant="body2" color="textSecondary">
            {updatedAt.getTime()>createdAt.getTime()?updatedAt.toLocaleString()+" (수정됨)" : createdAt.toLocaleString()}
          </Typography>
        </Box>
        <Box item>
          <FollowButton targetuserid={review.userId} />
          <Tooltip title="수정">
            <IconButton>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="삭제">
            <IconButton>
              <Delete />
            </IconButton>
          </Tooltip>
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
        {review.content}
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
    design: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  // dispatchPush: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(ReviewCard))