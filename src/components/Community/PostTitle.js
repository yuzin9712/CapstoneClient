// "/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Box,
  Typography,
  Avatar,
  IconButton,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

}));

const PostTitle = ({title, user}) => {
    const classes = useStyles();

    return(
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>{title}</Typography>
            </Grid>
            <Grid item container xs={12}>
                <Avatar item>{user}</Avatar>
                <Grid item flexGrow={1}>
                    <Typography>{user}</Typography>
                    <Typography variant="body2" color="textSecondary">언제 몇월 몇일 조회수 댓글수</Typography>
                </Grid>
                <Box item>
                    <IconButton>ㅋ</IconButton>
                    <IconButton>ㄴ</IconButton>
                    <IconButton>ㅇ</IconButton>
                    <IconButton>ㄷ</IconButton>
                </Box>
            </Grid>
        </Grid>
    )
}

PostTitle.propTypes = {
    title: PropTypes.string,
    user: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(PostTitle)
