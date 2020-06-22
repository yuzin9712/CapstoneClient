// PostList(커뮤니티 글 리스트)에 보여주는 요약 카드
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Box,
  Card,
  Typography,
  Avatar,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
} from '@material-ui/core'
import FollowButton from '../common/FollowButton';
import NameAvatarButton from '../common/NameAvatarButton';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    card: {
        display: 'flex',
        flexGrow: 1,
        margin: theme.spacing(2),
        '& > *': {
          padding: theme.spacing(2),
        },
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
    },
    media: {
        width: '100%',
        height: '100%',
    },
}));

const PostCard = ({post}) => {
    const classes = useStyles();

    const id = post.id
    const uname = post.user.name
    const title = post.title
    const content = post.content
    const summary = content.length>100?content.substring(0,100) + "...":content
    const thumbnail = post.Pimgs.length?post.Pimgs[0].img : ""

    // const createdAt = new Date(post.createdAt)
    // const updatedAt = new Date(post.updatedAt)
    const edited = moment(post.createdAt).isBefore(post.updatedAt)
    const commentcount = post.commentcount

    if(!post) return <div>ㅇㅅㅇ</div>
    else return(
        <Box component={Card} className={classes.card} elevation={0} square>
            <Grid container>
            <Grid item xs={12} sm={8} md={10} className={classes.cardContent}>
                <CardActionArea component={Link} to={"/community/post/"+id}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {title}
                        </Typography>
                        <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                            {summary}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <Box p={2} display="flex" height="100%" alignItems="flex-end">
                    <Box display="flex" flexDirection="row" flexGrow={1} alignItems="center">
                      <NameAvatarButton name={post.user.name} userId={post.user.id} />
                      <Box display="flex" flexDirection="column" flexGrow={1}>
                        <Typography variant="body2" color="textSecondary">{post.user.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {(moment(post.createdAt).toDate().toLocaleString())+(edited?" ("+moment(post.updatedAt).fromNow()+" 수정됨)":"")}
                        </Typography>
                      </Box>
                      <Typography>💬댓글 {commentcount}개 / 💗좋아요 {post.likecount}개</Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
            {/* <Avatar component={Link} to={"/community/post/"+id} */}
            <Avatar component={Link} to={`/community/post/${id}`}
                className={classes.media}
                src={thumbnail}
                variant="rounded"
            />
            </Grid>

            </Grid>
            
        </Box>
    )
}

PostCard.propTypes = {
    post: PropTypes.object,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    // pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(PostCard)
