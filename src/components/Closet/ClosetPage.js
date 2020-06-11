// "/design"에서 확인하는 추천코디페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Divider,
} from '@material-ui/core'

import ClosetList from './ClosetList'
import {yujinserver} from '../../restfulapi'

const useStyles = makeStyles((theme) => ({

}));

const fetchurl=yujinserver+"/page/closet"

const ClosetPage = () => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
    const [ closetList, setClosetList ] = useState(null);

    useEffect(() => {
        if(loading){
            fetch(fetchurl, {credentials: 'include',})
            .then(response => response.json(),
                error => console.error(error))
            .then(json => {
                setClosetList(
                    <ClosetList closets={json} reload={() => setLoading(true)} />
                )
                setLoading(false)
            })
        }
    }, [loading]);

    return(
        <Grid container direction="column">
            <Typography variant="h4">나의 옷장</Typography>
            <Divider />
            {closetList}
        </Grid>
    )
}

ClosetPage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    loginResult: state.auth.fetching,
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosetPage)
