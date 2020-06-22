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



const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1
    }
}));

const fetchurl = yujinserver+"/design/like";

const DesignLikePage = ({}) => {
  const [ loading, setLoading ] = useState(true);
  const [ designList, setDesignList ] = useState(null);

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
      <Typography variant="h4">좋아요 표시한 디자인</Typography>
      <Divider />
      {designList}
    </Grid>
  )
}

DesignLikePage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}

export default DesignLikePage
