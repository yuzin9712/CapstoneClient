// "/community/write"에서 커뮤니티 글쓰는페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { goBack, push } from 'connected-react-router'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  IconButton,
  TextField,
  ButtonBase,
  Avatar,
  GridList,
  GridListTile,
  Box,
} from '@material-ui/core'
import { PhotoCamera, Cancel, Check } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form'
import clsx from 'clsx'
import { useSnackbar } from 'notistack'
import { yujinserver } from '../../restfulapi'


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
        flexWrap: 'wrap',
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

const PostWritePage = ({backButtonAction, dispatchPush}) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [ loading, setLoading ] = useState(true);
    const [ images, setImages ] = useState([]);
    const [ closetData, setClosetData ] = useState([]);
    const { register, control, handleSubmit } = useForm();
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
      const postSubmit = (data) => {
        // console.log(data.content, images)
        const selectedClosetIds = closetData.filter((closet) => closet.selected).map((closet) => closet.closet.id)
        console.log(selectedClosetIds)
        let form = new FormData()
        // form.append("title", data.title)
        // form.append("content", data.content)
        // form.append("closet", selectedClosetIds)
        images.forEach((image) => {form.append("img", image)})
        // console.log(form.keys())
        
        // fetch(yujinserver+"/post", {
        //     method: "POST",
        //     body: form,
        //     credentials: 'include',
        //   })
        //   .then(
        //     response => response.text(),
        //     error => console.log(error)
        //   )
        //   .then((text) => {
        //       if(text === "success"){
        //         enqueueSnackbar("성공이요",{"variant": "success"});
        //         setOpen(false)
        //         dispatchPush("/design/recent")
        //       }
        //       else{
        //         enqueueSnackbar("실패따리",{"variant": "error"});
        //       }
        //   })

        fetch(yujinserver+"/post/img",{
            method: "POST",
            body: form,
            credentials: 'include',
          })
          .then(
            response => response.json(),
            error => console.log(error)
          )
          .then((json) => {
            const images = json;
            fetch(yujinserver+"/post",{
                method: "POST",
                headers: {
                  'Accept': 'application/json',
                  "Content-Type": "application/json",
                  'Cache': 'no-cache'
                },
                body: JSON.stringify({
                    title: data.title,
                    content: data.content,
                    imgs: images,
                    closet: selectedClosetIds,
                }),
                credentials: 'include',
            })
            .then(
              response => response.json(),
              error => console.log(error)
            )
            .then((json) => {
                if(json.postId !== undefined){
                  enqueueSnackbar("성공이요",{"variant": "success"});
                  dispatchPush("/community/post/"+json.postId)
                }
                else{
                    enqueueSnackbar("실패따리",{"variant": "error"});
                }
            })
          })
    }

    const imageUpload = <Grid className={classes.imageContainer}>
        {images.map((image, index) => {
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
        })}
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

    if(loading) return <Button disabled>옷장 공유하기</Button>
  else return(
        <Container maxWidth="md">
            <Grid container={Paper} className={classes.root}>
                <Grid item container>
                    <Typography className={classes.title} gutterBottom variant="h4">글쓰기</Typography>
                    <Button onClick={backButtonAction}>돌아가</Button>
                </Grid>
                <Divider />
                <form onSubmit={handleSubmit(postSubmit)}>
                    <Controller as={<TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="제목"
                        autoComplete="title"
                        autoFocus
                        />} 
                        name="title"
                        control={control}
                    />
                    <Controller as={<TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="content"
                        label="내용"
                        multiline
                        rows={12}
                        />} 
                        name="content"
                        control={control}
                    />
                    {imageUpload}
                    <Box>
                    <GridList className={classes.gridList} cols={5}>
                        {closetComponentList}
                    </GridList>

                    </Box>
                    <Button type="submit" fillWidth variant="contained" color="primary">Submit</Button>
                </form>
            </Grid>
        </Container>
    )
}

PostWritePage.propTypes = {
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
    backButtonAction: () => dispatch(goBack()),
    dispatchPush: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostWritePage)
