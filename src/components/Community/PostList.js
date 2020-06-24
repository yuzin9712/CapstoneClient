// 커뮤니티글 리스트
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Container,
  List,
  Box,
  Typography
} from '@material-ui/core'

import PostCard from './PostCard';

const useStyles = makeStyles((theme) => ({
    root:{
        padding: theme.spacing(2),
    }
}));

const PostList = ({posts}) => {
    const [ postCards, setPostCards ] = useState(null)

    useEffect(() => {
      if(posts){
        if(posts.length) setPostCards(posts.map((post) => {
          return <PostCard post={post} />
        }))
        else setPostCards(<Typography gutterBottom>작성된 게시글이 없어요.</Typography>)
      }
      else setPostCards(<Typography gutterBottom>작성된 게시글이 없어요.</Typography>)
    }, [posts])
    

    return(
      <Box p={2}>
        {postCards}
      </Box>
    )
}

PostList.propTypes = {
    fetchurl: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(PostList)
