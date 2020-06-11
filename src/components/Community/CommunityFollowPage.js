// "/community/follow"에서 팔로우한 사용자의 글만 보는 페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Divider,
  Button
} from '@material-ui/core'
import PostList from './PostList'

import {yujinserver} from '../../restfulapi'
import CommunitySubheader from './CommunitySubheader';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1
    }
}));

const fetchurl = yujinserver+"/post/followpost"

const CommunityFollowPage = () => {
    const classes = useStyles();
    const [ postList, setPostList ] = useState(null)

    useEffect(() => {
        fetch(fetchurl, {credentials: 'include',})
        .then(response => response.json(),
            error => console.error(error))
        .then(json => {
            setPostList(<PostList posts={json} />)
        })
    }, [])

    return(
        <Grid container direction="column">
            <CommunitySubheader />
            <Grid item container>
                <Typography className={classes.title} variant="h4">팔로우한 사람의 글</Typography>
            </Grid>
            <Divider />
            {postList}
        </Grid>
    )
}

CommunityFollowPage.propTypes = {
    pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(CommunityFollowPage)
