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
} from '@material-ui/core'

import DesignList from './DesignList'
import DesignSubheader from './DesignSubheader'
import {yujinserver} from '../../restfulapi'

const fetchurl = yujinserver+"/design/user/";

const DesignMypage = ({ authStore }) => {
  const [ loading, setLoading ] = useState(true);
  const [ designList, setDesignList ] = useState(null);

  useEffect(() => {
    if(loading){
      fetch(fetchurl+authStore.currentId, {credentials: 'include',})
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
      <Typography variant="h4">내 디자인</Typography>
      <Divider />
      {designList}
    </Grid>
  )
}

DesignMypage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DesignMypage)
