// PostList(커뮤니티 글 리스트)에 보여주는 요약 카드
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  ButtonBase
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

}));

const PostSummaryCard = ({post}) => {
    const classes = useStyles();

    const uname = post.userId
    const title = post.title
    const body = post.body
    const summary = body.length>100?" ー "+body.substring(0,100) + "...":" ー "+body

    return(
        <React.Fragment>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt={uname} src={"https://thispersondoesnotexist.com/"} />
                </ListItemAvatar>
                <ListItemText
                    primary={title}
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >{uname}</Typography>
                            {summary}
                        </React.Fragment>
                } />
            </ListItem>
            <Divider variant="inset" component="li" />
        </React.Fragment>
    )
}

PostSummaryCard.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PostSummaryCard)
