// "/design"에서 확인하는 추천코디페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Container,
  Typography,
  Divider,
} from '@material-ui/core'

import ClosetList from './ClosetList'
import {yujinserver} from '../../restfulapi'

const useStyles = makeStyles((theme) => ({

}));

const fetchurl=yujinserver+"/page/closet/"

const ClosetPage = ({authStore}) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
    const [ closetList, setClosetList ] = useState(null);

    useEffect(() => {
        if(loading){
            fetch(fetchurl+authStore.currentId, {credentials: 'include',})
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
        <Box display="flex" flexDirection="column" component={Container} maxWidth="md">
            <Typography variant="h4">나의 옷장</Typography>
            <Divider />
            {closetList}
        </Box>
    )
}

ClosetPage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    authStore: state.auth,
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosetPage)
