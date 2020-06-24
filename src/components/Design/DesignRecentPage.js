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

const fetchurl = yujinserver+"/page/design";

const DesignRecentPage = ({state}) => {
  const [ loading, setLoading ] = useState(true);
  const [ designList, setDesignList ] = useState(null);

  useEffect(() => {
    if(state !== undefined){
      if(state.reload) setLoading(true)
    }
  }, [state])
  useEffect(() => {
    if(loading){
      fetch(fetchurl, {credentials: 'include',})
      .then(
        response => response.json(),
        error => console.error(error)
      )
      .then(designs => {
        setDesignList(
          <DesignList designs={designs} reload={() => setLoading(true)} />
        )
        setLoading(false)
      })
    }
  }, [loading]);

  return(
    <Grid container direction="column">
      <DesignSubheader />
      <Typography variant="h4">모두의 최신 디자인</Typography>
      <Divider />
      {designList}
    </Grid>
  )
}

DesignRecentPage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  state: state.router.location.state,
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    designSetLikeList: (designs) => dispatch(designSetLikeList(designs))
})

export default connect(mapStateToProps, mapDispatchToProps)(DesignRecentPage)
