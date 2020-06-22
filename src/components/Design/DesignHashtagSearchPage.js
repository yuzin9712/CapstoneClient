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
import { followSetList } from '../../actions/follow';


const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1
    }
}));

const fetchurl = yujinserver+"/design/hashtag";

const DesignHashtagSearchPage = ({ match, }) => {
  const [ loading, setLoading ] = useState(true);
  const [ designList, setDesignList ] = useState(null);
  const currentTag = match.params.tag

  useEffect(() => {
    if(loading){
      fetch(fetchurl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify({
          hashtag: currentTag,
        }),
        credentials: 'include',
      })
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
  useEffect(() => {
    setLoading(true)
  }, [currentTag])

  return(
    <Grid container direction="column">
      <DesignSubheader />
        <Typography variant="h4">#{currentTag}</Typography>
      <Divider />
      {designList}
    </Grid>
  )
}

DesignHashtagSearchPage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    pathname: state.router.location.pathname,
    // search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    designSetLikeList: (designs) => dispatch(designSetLikeList(designs)),
    followSetList: (users) => dispatch(followSetList(users)),

})

export default connect(mapStateToProps, mapDispatchToProps)(DesignHashtagSearchPage)
