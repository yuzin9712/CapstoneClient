// 디자인 만들기 컴포넌트
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  GridList,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  GridListTile,
  ButtonBase,
  Typography,
  DialogActions,
  TextField,
} from '@material-ui/core'
import { Check } from '@material-ui/icons';


import {yujinserver} from '../../restfulapi'
import clsx from 'clsx';
import ChipInput from 'material-ui-chip-input'
import { push } from 'connected-react-router';
import TagInput from '../common/TagInput';

const useStyles = makeStyles((theme) => ({
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  previewImage: {
      width: theme.spacing(20),
      height: theme.spacing(20),
  },
  hide: {
      display: 'none'
  },
  checked: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .5)'
  }
}));

const DesignWrite = ({ authStore, dispatchPush }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [ loading, setLoading ] = useState(true);
  const [ open, setOpen ] = useState(false)
  const [ closetData, setClosetData ] = useState([]);
  const [ selectedClosetId, setSelectedClosetId] = useState(-1)
  const [ tags, setTags ] = useState([])

  useEffect(() => {
    if(loading){
      fetch(yujinserver+"/page/closet/"+authStore.currentId, { credentials: 'include', })
      .then(
        response => response.json(),
        error => console.error(error)
      )
      .then(json => {
        setClosetData(json)
        setLoading(false)
      })
    }
  }, [loading])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const closetComponentList = closetData.map((closet) => {
    return(
        <GridListTile key={closet.id}>
            <ButtonBase onClick={() => setSelectedClosetId(closet.id)}>
                <Avatar 
                    src={closet.img} 
                    variant="rounded"
                    className={classes.previewImage}
                />
                <Avatar 
                    variant="rounded"
                    className={clsx({
                        [classes.hide]: selectedClosetId !== closet.id,
                        [classes.checked]: selectedClosetId === closet.id
                    })}
                >
                    <Check />
                </Avatar>
            </ButtonBase>
        </GridListTile>
    )
  })

  const submitDesign = () => {
    if(selectedClosetId === -1){
        enqueueSnackbar("공유할 옷장을 선택해야되요",{"variant": "error"});
    }
    else{
        fetch(yujinserver+"/design/"+selectedClosetId, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              "Content-Type": "application/json",
              'Cache': 'no-cache'
            },
            body: JSON.stringify({
              content: tags
            }),
            credentials: 'include',
          })
          .then(
            response => response.text(),
            error => console.error(error)
          )
          .then((text) => {
              if(text === "success"){
                enqueueSnackbar("코디를 공유했습니다.",{"variant": "success"});
                setOpen(false)
                dispatchPush("/design/recent", {reload: true})
              }
              else{
                enqueueSnackbar("코디 공유에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
              }
          })
    }
  }

  if(loading) return <Button disabled>옷장 공유하기</Button>
  else return(
    <React.Fragment>
      <Button
            color="inherit"
            onClick={handleClickOpen}>💬옷장 공유하기</Button>
      <Dialog 
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="design-write-dialog"
      >
        <DialogTitle>옷장 공유하기</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>공유할 옷장을 선택하세요.</Typography>
          <GridList className={classes.gridList} cols={2.5}>
            {closetComponentList}
          </GridList>
          <TagInput tags={tags} setTags={(tags) => setTags(tags)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={submitDesign}>공유하기</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

DesignWrite.propTypes = {
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
  dispatchPush: (url, props) => dispatch(push(url, props))
})

export default connect(mapStateToProps, mapDispatchToProps)(DesignWrite)
