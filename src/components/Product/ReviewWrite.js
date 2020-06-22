// 리뷰글쓰기 컴포넌트
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


import {yujinserver, sangminserver} from '../../restfulapi'
import clsx from 'clsx';
import ChipInput from 'material-ui-chip-input'
import { push } from 'connected-react-router';
import { useForm } from 'react-hook-form';
import ImageInput from '../common/ImageInput';

const useStyles = makeStyles((theme) => ({
  hide: {
      display: 'none'
  },
}));

const ReviewWrite = ({ pid, reload }) => {
  const classes = useStyles();
  const [ images, setImages ] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [ open, setOpen ] = useState(false)
  const { register, handleSubmit } = useForm();

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const reviewSubmit = (data) => {
    let form = new FormData()
    images.forEach((image) => {form.append("img", image)})
    fetch(sangminserver+"/review/img",{
      method: "POST",
      body: form,
      credentials: 'include',
    })
    .then(
      response => response.json(),
      error => console.error(error)
    )
    .then((json) => {
      const images = json
      fetch(sangminserver+"/review/post/"+pid,{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify({
          content: data.content,
          imgs: json
        }),
        credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
          if(text === "OK"){
              enqueueSnackbar("리뷰를 작성했습니다.",{"variant": "success"});
              reload()
          }
          else{
              enqueueSnackbar("리뷰 작성에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
          }
      })
    handleClose()
    }
    )
  }
  return(
    <React.Fragment>
      <Button
            color="inherit"
            onClick={handleClickOpen}>💬리뷰 작성</Button>
      <Dialog 
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="design-write-dialog"
      >
        <DialogTitle>리뷰 작성</DialogTitle>
        <form onSubmit={handleSubmit(reviewSubmit)}>
          <DialogContent>
            <TextField
              inputRef={register({required: true})}
              variant="outlined"
              margin="normal"
              required
              multiline
              fullWidth
              id="content"
              name="content"
              label="내용"
              autoFocus
            />
            <ImageInput images={images} setImages={setImages} maxInput={3} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button type="submit">작성 완료</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}

ReviewWrite.propTypes = {
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
  // dispatchPush: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewWrite)
