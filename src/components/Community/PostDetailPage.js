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
} from '@material-ui/core'

import PostTitle from './PostTitle'
import { yujinserver } from '../../restfulapi';
import CommentWrite from './CommentWrite';
import FollowButton from './FollowButton';
import PostLikeButton from './PostLikeButton';
import ClosetDetail from './ClosetDetail';
import { Edit, Delete } from '@material-ui/icons';
import { push } from 'connected-react-router';
import { useSnackbar } from 'notistack';
import ConfirmPopover from '../Closet/ConfirmPopover';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      padding: theme.spacing(1),
      margin: theme.spacing(2),
    },
  },
  image: {
    width: '100%',
    height: '100%'
  },
  commentImage: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  }
}));

const PostDetailPage = ({authStore, pathname, push, match}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [ loading, setLoading ] = useState(true)
  const [ post, setPost ] = useState([]);
  const [ likes, setLikes ] = useState([]);
  const [ follow, setFollow ] = useState([]);
  const [popoverTarget, setPopoverTarget] = useState(null)

    useEffect(() => {
        if(loading){
            const id = match.params.id;
            console.log('id값은???', id)
            const postid = pathname.substring(pathname.lastIndexOf('/') + 1);
            fetch(yujinserver+"/post/"+id, {
                credentials: 'include',
            })
            .then(response => response.json())
            .then(json => {
                setPost(json)
                // console.log(json.post)
                setLoading(false)
            })
        }
    }, [loading])

    

    const classes = useStyles();
    

    

    if(loading || !post) return(<div>loading~</div>)
    else {
      const createdAt = new Date(post.createdAt)
      const updatedAt = new Date(post.updatedAt)
        const images = post.Pimgs.map((image) => {
            if(image.closet){
                // closet
                return <Box>
                    {/* <ButtonBase onClick={() => closetAction(image.closet)}>
                    <Avatar variant="rounded" src={image.img} className={classes.image} />
                    </ButtonBase> */}
                    <ClosetDetail closet={image} imagestyle={classes.image} />
                    </Box>
            }
            else{
                // image only
                return <Box>
                <ButtonBase>
                <Avatar variant="rounded" src={image.img} className={classes.image} />
                </ButtonBase>
                </Box>
            }
        })
        const commentDoms = post.postComments.map((comment) => {
            return(
                <Grid container direction="row" alignItems="center">
                    <Box p={2}>
                        <Avatar>
                            {comment.user.name.slice(0,1)}
                        </Avatar>
                        <FollowButton targetuserid={comment.user.id} />
                    </Box>
                    <Box flexDirection="column" flexGrow={1} component={Paper}>
                        <Grid container direction="row">
                            {comment.Cimgs.map((image) => {
                                if(image.closet){
                                    // closet
                                    return <Box>
                                        <ClosetDetail closet={image} imagestyle={classes.commentImage} />
                                        </Box>
                                }
                                else{
                                    // image only
                                    return <Box>
                                    <ButtonBase>
                                    <Avatar variant="rounded" src={image.img} className={classes.commentImage} />
                                    </ButtonBase>
                                    </Box>
                                }
                            })}
                        </Grid>
                        <Typography item gutterBottom>{comment.content}</Typography>
                    </Box>
                </Grid>
            )
        })

        const editPost = () => {
          push('/community/write',{originalPost: post})
        }
        const deletePost = () => {
          fetch(yujinserver+"/post/"+post.id,{
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
            error => console.log(error)
          )
          .then((text) => {
            if(text === 'success'){
              enqueueSnackbar("게시물을 삭제했습니다.",{"variant": "success"});
              push("/community/")
            }
            else if(text === '없는 게시물!'){
              enqueueSnackbar("잘못된 접근입니다.",{"variant": "error"});
              push("/community/")
            }
            else{
              enqueueSnackbar("게시물 삭제에 실패했습니다. 에러가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
            }
          })
        }

        return(
            <Container maxWidth="md" className={classes.root}>
                <Grid container component={Paper} direction="column" elevation={3}>
                    <Typography item variant="h4" gutterBottom>{post.title}</Typography>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <Avatar>{post.user.name.slice(0,1)}</Avatar>
                        <Box display="flex" flexDirection="column" flexGrow={1} px={1}>
                          <Typography>{post.user.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {updatedAt.getTime()>createdAt.getTime()?updatedAt.toLocaleString()+" (수정됨)" : createdAt.toLocaleString()} 댓글 {post.commentcount}개
                          </Typography>
                        </Box>
                        <Box>
                            <FollowButton targetuserid={post.user.id} />
                            <Button>작성글보기</Button>
                            <Button>코디 보기</Button>
                        </Box>
                    </Box>
                    <Divider />
                    <Box p={3}>
                      <Grid>
                          {images}
                      </Grid>
                      <Box py={1}>
                        {post.content.split('\n').map((i, key) => {
                          return <Typography key={key} gutterBottom variant="body1">{i}</Typography>;
                        })}
                      </Box>
                      <Container maxWidth="xs">
                          <Box display="flex" flexDirection="row" component={Paper} flexGrow={1} variant="outlined" justifyContent="space-around">
                              <PostLikeButton targetpostid={post.id} initialLike={post.likecount} />
                              <Button>공유</Button>
                          </Box>
                      </Container>

                      {post.userId === authStore.currentId?(
                        <Box display="flex" flexDirection="row" justifyContent="flex-end">
                          <Tooltip title="수정">
                            <IconButton onClick={editPost}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="삭제">
                            <IconButton onClick={(event) => setPopoverTarget(event.target)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                          <ConfirmPopover text="정말 삭제하시겠습니까?" target={popoverTarget} action={deletePost} cancel={() => setPopoverTarget(null)} />
                        </Box>
                      ):null}
                    </Box>
                </Grid>
                <Grid container direction="column">
                    <Typography flexGrow={1} gutterBottom variant="h6">댓글 {post.commentcount}개</Typography>
                    <Divider />
                    <CommentWrite postid={post.id} reload={() => setLoading(true)} />
                    {commentDoms}
                </Grid>
            </Container>
        )
    }
}

PostDetailPage.propTypes = {
    pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    pathname: state.router.location.pathname,
    authStore: state.auth,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url, props) => dispatch(push(url, props))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailPage)
