// 팔로우 여부에 따라 팔로우할지 언팔로우할지 보여주는 그 버튼~
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Tooltip, IconButton, MenuItem, Menu, Button,
} from '@material-ui/core'
import {
    Person as PersonIcon,
    PersonAdd as FollowIcon,
    PersonAddDisabled as UnfollowIcon,
    HowToReg,
    Palette,
  } from '@material-ui/icons'
import { requestFollow, requestUnfollow } from '../../actions/follow';
import { useSnackbar } from 'notistack';
import { sketchAddItem, handleDrawerOpen } from '../../actions/sketch';

const useStyles = makeStyles((theme) => ({
    follow: {
      color: theme.palette.info.main,
    },
    unfollow: {
      color: theme.palette.error.main,
    }
}));

const TryButton = ({pid, previews, fullButton, addItem, openDrawer, variant, handleDrawerOpen}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTry = (preview) => {
    const proxyImage = preview.img.replace('https://swcap02.s3.ap-northeast-2.amazonaws.com','/images')
    addItem(pid, preview.color, proxyImage)
    enqueueSnackbar("코디툴에 넣었습니다.",{variant:"success", action: () => <Button onClick={() => handleDrawerOpen()}>코디툴 열기</Button>})
    handleClose()
  }

  const button = fullButton?(
    <Button onClick={handleOpen} variant={variant}>
      <Palette /> 코디해보기
    </Button>
  ) : (
    <Tooltip 
      title="코디해보기"
    >
      <IconButton 
        aria-label="try" 
        centerRipple 
        onClick={handleOpen}>
        <Palette />
      </IconButton>
    </Tooltip>
  )

  return(
    <React.Fragment>
      {button}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handleClose}
      >
        {previews !== undefined? previews.map((preview) => (
          <MenuItem onClick={() => handleTry(preview)}>{preview.color}</MenuItem>
        ))
        : <MenuItem onClick={handleClose}>누끼이미지가없어요~</MenuItem>}
      </Menu>
    </React.Fragment>
  )
}

TryButton.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}

const mapStateToProps = state => ({
//   sessionId: state.auth.currentId,
//   followStore: state.follow,
})

const mapDispatchToProps = (dispatch) => ({
  addItem: (pid, color, img) => dispatch(sketchAddItem(pid, color, img)),
  handleDrawerOpen: () => dispatch(handleDrawerOpen())
//   requestFollow: (userId) => dispatch(requestFollow(userId)),
//   requestUnfollow: (userId) => dispatch(requestUnfollow(userId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TryButton)
