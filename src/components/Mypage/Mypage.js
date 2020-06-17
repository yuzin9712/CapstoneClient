// 마이페이지 헤더
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {  
  makeStyles,
  Box, 
  Typography, } from '@material-ui/core'
import MypageSubheader from './MypageSubheader'
import MypageDesignView from './MypageDesignView'
import MypageCommunityView from './MypageCommunityView'


const Mypage = ({authStore, search, match}) => {
  const [currentView, setCurrentView] = useState(null)

  useEffect(() => {
    switch(search){
      case "?community": {
        setCurrentView(
          <MypageCommunityView targetId={match.params.id} />
        )
        break
      }
      default: {
        setCurrentView(
          <MypageDesignView targetId={match.params.id} />
        )
      }
    }
  }, [search])

  return(
    <Box display="flex" flexDirection="column">
      <MypageSubheader userId={match.params.id}/>
      {currentView}
    </Box>
  )
}

Mypage.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  authStore: state.auth,
  //pathname: state.router.location.pathname,
  search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(Mypage)