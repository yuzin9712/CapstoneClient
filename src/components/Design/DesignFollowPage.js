// "/design"에서 확인하는 추천코디페이지
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

import DesignList from './DesignList'
import DesignWrite from './DesignWrite'
import DesignSubheader from './DesignSubheader'
import {yujinserver} from '../../restfulapi'

import { designSetLikeList } from '../../actions/design'


const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1
    }
}));

const fetchurl = yujinserver+"/design/followpost";

const DesignFollowPage = ({ designSetLikeList }) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
    const [ designs, setDesigns ] = useState([]);

    useEffect(() => {
        fetch(fetchurl, {credentials: 'include',})
        .then(response => response.json(),
            error => console.error(error))
        .then(json => {
            setDesigns(json)
        })
        setLoading(false)
    }, []);

    if(loading) return(<div>로딩중요</div>)
    else return(
        <Grid container direction="column">
            <DesignSubheader />
            <Grid item container>
                <Typography variant="h4">팔로우한 유저의 디자인</Typography>
            </Grid>
            <Divider />
            <DesignList designs={designs} />
        </Grid>
    )
}

DesignFollowPage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    designSetLikeList: (designs) => dispatch(designSetLikeList(designs))
})

export default connect(mapStateToProps, mapDispatchToProps)(DesignFollowPage)
