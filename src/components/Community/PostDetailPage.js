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
} from '@material-ui/core'

import PostTitle from './PostTitle'
import { yujinserver } from '../../restfulapi';
import CommentWrite from './CommentWrite';
import FollowButton from './FollowButton';
import PostLikeButton from './PostLikeButton';
import ClosetDetail from './ClosetDetail';

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

const PostDetailPage = ({pathname}) => {
    const [ loading, setLoading ] = useState(true)
    const [ post, setPost ] = useState([]);
    const [ likes, setLikes ] = useState([]);
    const [ follow, setFollow ] = useState([]);

    useEffect(() => {
        if(loading){
            const postid = pathname.substring(pathname.lastIndexOf('/') + 1);
            fetch(yujinserver+"/post/"+postid, {
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
        const closetAction = (json) => {
            alert(JSON.stringify(json))
        }
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
                            {comment.user.name}
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

        return(
            <Container maxWidth="md" className={classes.root}>
                <Grid container component={Paper} direction="column" elevation={3}>
                    <Typography item variant="h4" gutterBottom>{post.title}</Typography>
                    <Grid item container>
                        <Avatar item>{post.user.name}</Avatar>
                        <Box item direction="column" flexGrow={1}>
                            <Typography>{post.user.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {post.updatedAt} {post.createdAt !== post.updatedAt?"(수정됨)":""} 댓글 {post.commentcount}개
                            </Typography>
                        </Box>
                        <Box item>
                            <FollowButton targetuserid={post.user.id} />
                            <Button>작성글보기</Button>
                            <Button>코디 보기</Button>
                        </Box>
                    </Grid>
                    <Divider />
                    <Grid>
                        {images}
                    </Grid>
                    <Typography paragraph gutterBottom>{post.content}</Typography>
                    <Container maxWidth="xs">
                        <Box component={Paper} flexGrow={1} variant="outlined" justifyContent="center">
                            <PostLikeButton targetpostid={post.id} initialLike={post.likecount} />
                            <Button>공유</Button>
                        </Box>
                    </Container>
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
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailPage)
