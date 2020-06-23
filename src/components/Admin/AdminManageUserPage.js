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
import AdminManagingUserCard from './AdminManagingUserCard';

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none'
  },
}));

const AdminManageUserPage = ({authStore, push}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true)
  const [normalUserList, setNormalUserList] = useState([])
  const [deletedUserList, setDeletedUserList] = useState([])

  useEffect(() => {
    if(authStore.session !== 'admin'){
      enqueueSnackbar("권한이 없습니다.",{"variant": "error"});
      push("/")
    }
    else if(loading){
      fetch(yujinserver+"/admin/users", {credentials: 'include',})
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then((json) => {
        setNormalUserList(json.normalUsers.map((user) => {
          if(user !== null){
            return(
              <AdminManagingUserCard key={user.id} user={user} reload={() => setLoading(true)} />
            )
          }
        }))
        setDeletedUserList(json.deletedUsers.map((user) => {
          if(user !== null){
            return(
              <AdminManagingUserCard key={user.id} user={user} reload={() => setLoading(true)} />
            )
          }
        }))
        setLoading(false)
      })
    }
  }, [authStore, loading])

  return(
    <Box display="flex" flexDirection="column" className={clsx({
      [classes.hide]: authStore.session !== 'admin'
    })}>
      <AdminSubheader />
      <Typography gutterBottom>유저관리</Typography>
      <Divider />
      <Box p={1} display="flex" flexDirection="column">
        <Typography gutterBottom>활동중인 유저</Typography>
        <Divider />
        <Grid container component={Box} p={1}>
          {normalUserList}
        </Grid>
      </Box>
      <Box p={1} display="flex" flexDirection="column">
        <Typography gutterBottom>탈퇴처리된 유저</Typography>
        <Divider />
        <Grid container component={Box} p={1}>
          {deletedUserList}
        </Grid>
      </Box>
    </Box>
  )
}

AdminManageUserPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminManageUserPage)
