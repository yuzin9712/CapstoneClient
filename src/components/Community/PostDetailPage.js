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
import FollowButton from '../common/FollowButton';
import PostLikeButton from './PostLikeButton';
import ClosetDetail from './ClosetDetail';
import { Edit, Delete } from '@material-ui/icons';
import { push } from 'connected-react-router';
import { useSnackbar } from 'notistack';
import ConfirmPopover from '../common/ConfirmPopover';
import NameAvatarButton from '../common/NameAvatarButton';
import CommentCard from './CommentCard';
import moment from 'moment'
import CommunitySubheader from './CommunitySubheader';

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
            const postid = pathname.substring(pathname.lastIndexOf('/') + 1);
            fetch(yujinserver+"/post/"+id, {
                credentials: 'include',
            })
            .then(response => response.json())
            .then(json => {
                setPost(json)
                setLoading(false)
            })
        }
    }, [loading])

    

    const classes = useStyles();
    

    

    if(loading || !post) return(<div>loading~</div>)
    else {
      // const createdAt = new Date(post.createdAt)
      // const updatedAt = new Date(post.updatedAt)
      const edited = moment(post.createdAt).isBefore(post.updatedAt)
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
              <CommentCard comment={comment} reload={() => setLoading(true)} />
            )
        })

        const editPost = () => {
          if(post.userId !== authStore.currentId){
            enqueueSnackbar("권한이 없습니다.",{"variant": "error"});
            push("/community/")
          }
          else{
            push('/community/write',{originalPost: post})
          }
        }
        const deletePost = () => {
          if((post.userId !== authStore.currentId)&&(authStore.session !== 'admin')){
            enqueueSnackbar("권한이 없습니다.",{"variant": "error"});
            push("/community/")
          }
          else{
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
              error => console.error(error)
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
        }

        return(
            <Container maxWidth="md" className={classes.root}>
              <CommunitySubheader />
                <Grid container component={Paper} direction="column" elevation={3}>
                    <Typography variant="h4" gutterBottom>{post.title}</Typography>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <NameAvatarButton name={post.user.name} userId={post.user.id} />
                        <Box display="flex" flexDirection="column" flexGrow={1}>
                          <Typography>{post.user.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {(moment(post.createdAt).toDate().toLocaleString())+(edited?" ("+moment(post.updatedAt).fromNow()+" 수정됨)":"")}
                          </Typography>
                        </Box>
                          <Typography>💬댓글 {post.commentcount}개</Typography>
                    </Box>
                    <Divider />
                    <Box p={3}>
                      <Grid container>
                          {images}
                      </Grid>
                      <Box py={1}>
                        {post.content.split('\n').map((i, key) => {
                          return <Typography key={key} gutterBottom variant="body1">{i}</Typography>;
                        })}
                      </Box>
                      <Container maxWidth="xs">
                          <Box mx={10} display="flex" flexDirection="column" flexGrow={1} component={Paper} variant="outlined" alignItems="center">
                            <PostLikeButton targetpostid={post.id} initialLike={post.likecount} />
                            <Box display="flex" flexDirection="row">
                              {post.userId === authStore.currentId?(
                                <Tooltip title="수정">
                                  <IconButton onClick={editPost}>
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                              ):null}
                              {(post.userId === authStore.currentId)||(authStore.session === 'admin')?(
                                <>
                                  <Tooltip title="삭제">
                                    <IconButton onClick={(event) => setPopoverTarget(event.target)}>
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                  <ConfirmPopover text="정말 삭제하시겠습니까?" target={popoverTarget} action={deletePost} cancel={() => setPopoverTarget(null)} />
                                </>
                              ):null}
                            </Box>
                          </Box>
                      </Container>
                    </Box>
                </Grid>
                <Grid container direction="column">
                    <Typography gutterBottom variant="h6">댓글 {post.commentcount}개</Typography>
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
