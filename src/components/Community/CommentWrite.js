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
  Box,
} from '@material-ui/core'
import { Check, Cancel, PhotoCamera } from '@material-ui/icons';


import {yujinserver} from '../../restfulapi'
import clsx from 'clsx';
import ChipInput from 'material-ui-chip-input'
import { push } from 'connected-react-router';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  title: {
      flexGrow: 1,
  },
  imageContainer: {
    display: 'flex',
  },
  upImageButton: {
      width: theme.spacing(20),
      height: theme.spacing(20),
  },
  hide: {
      display: 'none',
  },
  gridList: {
      width: '100%',
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
  previewImage: {
      width: theme.spacing(20),
      height: theme.spacing(20),
  },
  previewCancel: {
    border: "1px solid white",
    backgroundColor: "white",
    borderRadius: "50%",
    position: "absolute",
    top: '1px',
    right: '1px',
  },
  checked: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .5)'
  }
}));

const CommentWrite = ({ dispatchPush, postid, reload }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [ loading, setLoading ] = useState(true);
  const [ images, setImages ] = useState([]);
  const [ open, setOpen ] = useState(false)
  const [ closetData, setClosetData ] = useState([]);
  const [ selectedClosetId, setSelectedClosetId] = useState(-1)
  const [ tags, setTags ] = useState([])
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    if(loading){
      fetch(yujinserver+"/page/closet", { credentials: 'include', })
      .then(
        response => response.json(),
        error => console.log(error)
      )
      .then(json => {
        setClosetData(json.map((closet) => ({
          selected: false,
          closet: closet
        })))
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

  const handleClosetInput = (index) => {
    const newList = [...closetData]
    newList[index].selected = !newList[index].selected
    setClosetData(newList)
  }

  const closetComponentList = closetData.map((closet, index) => {
    return(
        <GridListTile key={closet.closet.id}>
            <ButtonBase disableRipple onClick={() => handleClosetInput(index)}>
                <Avatar 
                    src={closet.closet.img} 
                    variant="rounded"
                    className={classes.previewImage}
                />
                <Avatar 
                    variant="rounded"
                    className={clsx({
                        [classes.hide]: !closet.selected,
                        [classes.checked]: closet.selected
                    })}
                >
                    <Check />
                </Avatar>
            </ButtonBase>
        </GridListTile>
    )
})
  const imagePreview = images.map((image, index) => {
      return(
      <React.Fragment>
          <ButtonBase variant="rounded">
          <Avatar src={URL.createObjectURL(image)} 
              variant="rounded"
              className={classes.previewImage}
          />
          </ButtonBase>
          <ButtonBase onClick={() => removeImage(index)}>
          <Cancel className={classes.previewCancel}/>
          </ButtonBase>
      </React.Fragment>
      )
  })

  const handleImageInput = (event) => {
    if(images.length < 3){
      if(event.target.files[0] !== undefined){
        setImages([...images, event.target.files[0]]);
      }
    }
  }
  const removeImage = (index) => {
    const newList = [...images];
    newList.splice(index, 1);
    setImages(newList);
  }
  const imageUpload = <Grid className={classes.imageContainer}>
        {imagePreview}
        <input 
            accpet="image/*"
            className={classes.hide}
            id="icon-button-file"
            name="photo"
            multiple
            type="file"
            onChange={(event) => handleImageInput(event)}
        />
        <label htmlFor="icon-button-file">
        <Avatar variant="rounded" className={clsx({
            [classes.previewImage]: true,
            [classes.hide]: images.length >= 3
        })}>
            <PhotoCamera />
        </Avatar>
        </label>
    </Grid>

  const submitComment = (data) => {
    const selectedClosetIds = closetData.filter((closet) => closet.selected).map((closet) => closet.closet.id)
    let form = new FormData()
    images.forEach((image) => {form.append("img", image)})

    fetch(yujinserver+"/comment/img",{
      method: "POST",
      body: form,
      credentials: 'include',
    })
    .then(
      response => response.json(),
      error => console.log(error)
    )
    .then((json) => {
      const uploadedImages = json;
      fetch(yujinserver+"/comment/post/"+postid,{
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Cache': 'no-cache'
          },
          body: JSON.stringify({
              content: data.content,
              imgs: uploadedImages,
              closet: selectedClosetIds,
          }),
          credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.log(error)
      )
      .then((text) => {
          if(text === "댓글 등록 성공!!!"){
              enqueueSnackbar("댓글을 달았어요",{"variant": "success"});
              reload()
          }
          else{
              enqueueSnackbar("실패따리",{"variant": "error"});
          }
      })
    })
  }
  const imageClosetPreview = () => {
    const closetPreview = closetData.map((closet, index) => {
      if(closet.selected){
        return <React.Fragment>
          <ButtonBase variant="rounded">
          <Avatar src={closet.closet.img} 
              variant="rounded"
              className={classes.previewImage}
          />
          </ButtonBase>
          <ButtonBase onClick={() => handleClosetInput(index)}>
          <Cancel className={classes.previewCancel}/>
          </ButtonBase>
        </React.Fragment>
      }
    })
    return <React.Fragment>
      {imagePreview}
      {closetPreview}
    </React.Fragment>
  }

  if(loading) return <Button disabled>💬댓글쓰기</Button>
  else return(
    <React.Fragment>
      <form onSubmit={handleSubmit(submitComment)}>
        <Box py={1}>
          <Grid container direction="row" alignItems="center">
            <Box flexGrow={1}>
              <TextField 
                inputRef={register({required: true})}
                required
                multiline
                name="content"
                label="댓글 작성"
                fullWidth 
                variant="outlined" 
              />
            </Box>
            <Box flexDirection="column">
              <Button
                color="inherit"
                onClick={handleClickOpen}
                variant="outlined">📷사진/옷장 첨부</Button>
              <Button
                type="submit"
                color="inherit"
                variant="outlined">💬댓글쓰기</Button>
            </Box>
          </Grid>
          {imageClosetPreview()}
        </Box>
      </form>
      <Dialog 
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="design-write-dialog"
      >
        <DialogTitle>미디어 공유</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>이미지 게시</Typography>
          {imageUpload}
          <Typography gutterBottom>옷장 게시</Typography>
          <GridList className={classes.gridList} cols={2.5}>
            {closetComponentList}
          </GridList>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>완료</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

CommentWrite.propTypes = {
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
  dispatchPush: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentWrite)
