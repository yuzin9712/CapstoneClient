// "/admin/manageShop"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Container, Divider, Typography, Paper, IconButton, Tooltip,
} from '@material-ui/core'
import Trade from '../Trade'
import AdminSubheader from './ShopSubheader';
import { useSnackbar } from 'notistack';
import { push } from 'connected-react-router';
import clsx from 'clsx';
import { yujinserver } from '../../restfulapi';
import NameAvatarButton from '../common/NameAvatarButton';
import { Clear } from '@material-ui/icons';
import ConfirmPopover from '../common/ConfirmPopover';

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none'
  },
}));

const AdminManagingUserCard = ({user, reload, authStore, push}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [normalUserList, setNormalUserList] = useState([])
  const [popoverTarget, setPopoverTarget] = useState(null)

  useEffect(() => {
    if(authStore.session !== 'admin'){
      wrapup()
    }
  }, [authStore])

  const wrapup = () => {
    enqueueSnackbar("권한이 없습니다.",{"variant": "error"});
    setPopoverTarget(null)
    push("/")
  }

  const deleteUser = () => {
    if(authStore.session !== 'admin'){
      wrapup()
    }
    else{
      fetch(yujinserver+"/admin/deleteUser",{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify({
          uid: user.id,
        }),
        credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === "user delete success"){
          enqueueSnackbar(user.name+": 탈퇴처리했습니다.",{"variant": "success"});
          reload()
        }
        else{
          enqueueSnackbar("탈퇴처리에 실패했습니다. 문제가 계속되면 담당자에게 문의해주세요.",{"variant": "error"});
        }
      })
    }
  }

  return(
    <>
      <Box width={1/2} p={1}>
        <Box component={Paper} p={1} display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="row" alignItems="center">
            <NameAvatarButton name={user.name} userId={user.id} />
            <Box display="flex" flexDirection="column">
              <Typography>{user.name}</Typography>
              <Typography variant="body2" color="textSecondary">{user.email}</Typography>
            </Box>
          </Box>
          <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end">
            <Tooltip title="유저 탈퇴처리">
              <IconButton onClick={(event) => setPopoverTarget(event.target)}>
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <ConfirmPopover text="정말 탈퇴처리하시겠습니까? 이 작업은 복구할 수 없습니다." target={popoverTarget} action={deleteUser} cancel={() => setPopoverTarget(null)} />
    </>
  )
}

AdminManagingUserCard.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  authStore: state.auth
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminManagingUserCard)