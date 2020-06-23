// 마이페이지 헤더
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Subheader from '../Header/Subheader'
import { Box, Typography, makeStyles, Divider, IconButton, Tooltip } from '@material-ui/core'
import RawNameAvatar from '../common/RawNameAvatar'
import { yujinserver } from '../../restfulapi'
import FollowButton from '../common/FollowButton'
import Logo from '../../../public/logo.png'
import { Chat, LocalPharmacyRounded } from '@material-ui/icons'
import { push, goBack } from 'connected-react-router'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme) => ({
  background: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    backgroundImage: `url(http://picsum.photos/1000/300)`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%",
    width: "100%",
  },
  filter: {
    backdropFilter: `grayscale(0.5) blur(8px)`,
    WebkitBackdropFilter: `grayscale(0.5) blur(8px)`,
  },
  user: {
    backgroundColor: "rgb(255,255,255)",
    backgroundColor: "rgba(255,255,255, 0.4)",
    borderRadius: 50,
  }
}));

const MypageSubheader = ({actor, target, isOwner, push }) => {
  const classes = useStyles();

  const menus = isOwner?[
    {component: "💎추천코디 공유글", path: "/mypage/"+target.id+"?page=design"},
    {component: "👀커뮤니티 게시글", path: "/mypage/"+target.id+"?page=community"},
    {component: "📬쪽지함", path: "/mypage/"+target.id+"?page=message"},
    {component: "✨나의 옷장", path: "/mypage/"+target.id+"?page=closet"},
  ]:[
    {component: "💎추천코디 공유글", path: "/mypage/"+target.id+"?page=design"},
    {component: "👀커뮤니티 게시글", path: "/mypage/"+target.id+"?page=community"},
  ]

  return(
    <Box display="flex" flexDirection="column">
      <Box className={classes.background}>
        <Box px={6} py={3} display="flex" className={classes.filter}>
          <Box p={3} display="flex" flexDirection="row" alignItems="center" className={classes.user}>
            <RawNameAvatar size={10} name={target.name} />
            <Box px={2} display="flex" flexDirection="column">
              <Box display="flex" flexDirection="row" alignItems="center">
                <Typography variant="h5">{target.name}</Typography>
                {!isOwner?
                <React.Fragment>
                  <FollowButton targetuserid={parseInt(target.id)} />
                  <Tooltip title="쪽지보내기">
                    <IconButton onClick={() => push("/mypage/"+actor+"?page=message&to="+target.id, {target: target.name})}>
                      <Chat />
                    </IconButton>
                  </Tooltip>
                </React.Fragment>
                :null}
              </Box>
              <Box pt={1} display="flex" flexDirection="row">
                <Box pr={2} display="flex" flexDirection="column">
                  <Typography variant="body2">팔로잉 수</Typography>
                  <Divider />
                  <Typography align="right" variant="h6">{target.Followingnum}</Typography>
                </Box>
                <Box pr={2} display="flex" flexDirection="column">
                  <Typography variant="body2">팔로워 수</Typography>
                  <Divider />
                  <Typography align="right" variant="h6">{target.Followernum}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Subheader menus={menus} additionalButton={null}/>
    </Box>
  )
}

MypageSubheader.propTypes = {
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
  push: (url, props) => dispatch(push(url, props)),
  goBack: () => dispatch(goBack())
})

export default connect(mapStateToProps, mapDispatchToProps)(MypageSubheader)