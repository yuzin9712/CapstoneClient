// "/community/post/:id"에서 확인하는 글 상세보기 페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Box,
  Divider,
  ButtonBase,
  GridList,
  Button,
  Tooltip,
  TextField,
} from '@material-ui/core'

import PostTitle from './PostTitle'
import { yujinserver } from '../../restfulapi';
import CommentWrite from './CommentWrite';
import FollowButton from '../common/FollowButton';
import PostLikeButton from './PostLikeButton';
import ClosetDetail from './ClosetDetail';
import { Edit, Delete, AccountBox, Done, Clear } from '@material-ui/icons';
import { push } from 'connected-react-router';
import { useSnackbar } from 'notistack';
import ConfirmPopover from '../common/ConfirmPopover';
import NameAvatarButton from '../common/NameAvatarButton';
import { useForm } from 'react-hook-form';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  commentImage: {
    width: theme.spacing(15),
    height: theme.spacing(15)
  }
}));

const CommentCard = ({authStore, comment, reload}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [content, setContent] = useState(null)
  const [edit, setEdit] = useState(false)
  const [popoverTarget, setPopoverTarget] = useState(null)
  const [fetching, setFetching] = useState(false)
  const edited = Date.parse(comment.createdAt) < Date.parse(comment.updatedAt)

  useEffect(() => {
    if(!edit){
      setContent(
        comment.content.split('\n').map((i, key) => {
          return <Typography key={key} paragraph variant="body1">{i}</Typography>;
        })
      )
    }
    else {
      setContent(
        <form id={"comment-"+comment.id+"-edit-form"} onSubmit={handleSubmit(submitCommentEdit)}>
          <TextField
          required
          multiline
          fullWidth
          autoFocus
          inputRef={register({})}
          defaultValue={comment.content}
          variant="outlined"
          margin="normal"
          name="editedContent"
          label="내용" />
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Tooltip title="수정 취소">
              <IconButton onClick={() => setEdit(false)}>
                <Clear />
              </IconButton>
            </Tooltip>
            <Tooltip title="적용">
              <IconButton disabled={fetching} type="submit">
                <Done />
              </IconButton>
            </Tooltip>
          </Box>
        </form>
      )
    }
  }, [comment.content, edit])

  const submitCommentEdit = (data) => {
    if((data.editedContent !== comment.content) && !fetching){
      setFetching(true)
      fetch(yujinserver+"/comment/post/"+comment.id,{
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify({
          content: data.editedContent
        }),
        credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === 'success'){
          enqueueSnackbar("댓글을 수정했어요",{"variant": "success"});
          reload()
        }
        else{
          enqueueSnackbar("댓글 수정에 실패했어요. 오류가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
        setFetching(false)
      })
    }
    setEdit(false)
  }
  const deleteComment = () => {
    if(!fetching){
      setFetching(true)
      fetch(yujinserver+"/comment/post/"+comment.id,{
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === 'success'){
          enqueueSnackbar("댓글을 삭제했어요",{"variant": "success"});
          reload()
        }
        else if(text === '없는 댓글!!'){
          enqueueSnackbar("이미 삭제된 댓글이에요",{"variant": "error"});
        }
        else{
          enqueueSnackbar("댓글 삭제에 실패했어요. 오류가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
        }
        setFetching(false)
      })
    }
  }

  return(
    <Box display="flex" flexDirection="row" p={1}>
      <Box>
        <NameAvatarButton name={comment.user.name} userId={comment.user.id} />
      </Box>
      <Box p={1} flexDirection="column" flexGrow={1} component={Paper}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box flexGrow={1} display="flex" flexDirection="row" alignItems="flex-end">
            <Typography><strong>{comment.user.name}</strong>님의 댓글</Typography>
            <Typography variant="body2" color="textSecondary">{" ー "+(moment(comment.updatedAt).fromNow()) + (edited?" (수정됨)":"")}</Typography>
          </Box>
          {comment.user.id === authStore.currentId?(
            edit?(
              <Box display="flex" flexDirection="row" justifyContent="flex-end">
                <Tooltip title="수정 취소">
                  <IconButton onClick={() => setEdit(false)}>
                    <Clear />
                  </IconButton>
                </Tooltip>
                <Tooltip title="적용">
                  <IconButton disabled={fetching} type="submit" form={"comment-"+comment.id+"-edit-form"} >
                    <Done />
                  </IconButton>
                </Tooltip>
              </Box>
            ):(
              <Box display="flex" flexDirection="row" justifyContent="flex-end">
                <Tooltip title="수정">
                  <IconButton onClick={() => setEdit(true)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="삭제">
                  <IconButton onClick={(event) => setPopoverTarget(event.target)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
                <ConfirmPopover text="정말 삭제하시겠습니까?" target={popoverTarget} action={deleteComment} cancel={() => setPopoverTarget(null)} />
              </Box>
            )
          ):null}
        </Box>
        <Divider />
        <Grid container direction="row" component={Box} py={1}>
          {comment.Cimgs.map((image) => {
            if(image.closet){ // closet
              return(
                <Box>
                  <ClosetDetail closet={image} imagestyle={classes.commentImage} />
                </Box>
              )
            }
            else { // image only
                return(
                  <Box>
                    <ButtonBase>
                      <Avatar variant="rounded" src={image.img} className={classes.commentImage} />
                    </ButtonBase>
                  </Box>
                )
            }
          })}
        </Grid>
        {content}
      </Box>
    </Box>
  )

}

CommentCard.propTypes = {
  comment: PropTypes.object.isRequired,
  // pathname: PropTypes.string,
  // search: PropTypes.string,
  // hash: PropTypes.string,
}

const mapStateToProps = state => ({
  authStore: state.auth,
  // pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url, props) => dispatch(push(url, props))
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentCard)
