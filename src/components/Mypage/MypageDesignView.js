// "/design"에서 확인하는 추천코디페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {yujinserver} from '../../restfulapi'
import DesignList from '../Design/DesignList';

const fetchurl = yujinserver+"/design/user/";

const DesignMypage = ({ targetId }) => {
    const [ loading, setLoading ] = useState(true);
    const [ designs, setDesigns ] = useState([]);
    useEffect(() => {
      if(loading){
        fetch(fetchurl+targetId, {credentials: 'include',})
        .then(response => response.json(),
            error => console.error(error))
        .then(json => {
            setDesigns(json)
        })
        setLoading(false)
      }
    }, [loading, targetId]);

    if(loading) return(<div>로딩중요</div>)
    else return(
      <DesignList designs={designs} reload={() => setLoading(true)} />
    )
}

DesignMypage.propTypes = {
    //pathname: PropTypes.string,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  // authStore: state.auth,
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    designSetLikeList: (designs) => dispatch(designSetLikeList(designs))
})

export default connect(mapStateToProps, mapDispatchToProps)(DesignMypage)
