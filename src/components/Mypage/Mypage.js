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
import { yujinserver } from '../../restfulapi'
import queryString from 'query-string'
import MessagePage from '../Message/MessagePage'
import ClosetPage from '../Closet/ClosetPage'
import { push, goBack } from 'connected-react-router'
import { useSnackbar } from 'notistack'


const Mypage = ({authStore, search, match, push, goBack}) => {
  const isOwner = authStore.currentId === parseInt(match.params.id)
  const { enqueueSnackbar } = useSnackbar();
  const [currentView, setCurrentView] = useState(null)
  const [subheader, setSubheader] = useState(null)
  const [target, setTarget] = useState({
    type: "fetching"
  })

  useEffect(() => {
    fetch(yujinserver+"/user/"+match.params.id, {credentials: "include"})
    .then(
      (res) => res.json(),
      (error) => console.error(error)
    )
    .then((json) => {
      if(json.type === 'deleted'){
        enqueueSnackbar("탈퇴한 회원입니다.",{"variant": "error"});
        goBack()
      }
      else{
        setTarget({
          ...json.userInfo,
          type: json.type,
        })
      }
    })
  }, [match])

  useEffect(() => {
    if(target.type !== "fetching"){
      setSubheader(
        <MypageSubheader 
        actor={authStore.currentId}
        target={target}
        isOwner={isOwner} />
      )
    }
  }, [target])

  useEffect(() => {
    const parse = queryString.parse(search)
    if(target.type !== "fetching"){
      switch(parse.page){
        case "community": {
          setCurrentView(
            <MypageCommunityView targetId={target.id} />
          )
          break
        }
        case "message": {
          if(isOwner) setCurrentView(
            <MessagePage actor={target} />
          )
          else push("/mypage/"+authStore.currentId+search)
          break
        }
        case "closet": {
          if(isOwner) setCurrentView(
            <ClosetPage actor={target.id} />
          )
          else push("/mypage/"+authStore.currentId+search)
          break
        }
        default: {
          setCurrentView(
            <MypageDesignView targetId={target.id} />
          )
        }
      }
    }
  }, [search, target])

  return(
    <Box display="flex" flexDirection="column">
      {subheader}
      {/* <MypageSubheader userId={match.params.id}/> */}
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
  push: (url) => dispatch(push(url)),
  goBack: () => dispatch(goBack()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Mypage)