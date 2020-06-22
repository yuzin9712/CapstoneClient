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
import ImageInput from '../common/ImageInput'


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


const PostWritePage = ({authStore, originalPost, backButtonAction, dispatchPush}) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [ loading, setLoading ] = useState(true);
    const [ images, setImages ] = useState([]);
    const [ closetData, setClosetData ] = useState([]);
    const { register, control, handleSubmit } = useForm();
    useEffect(() => {
        if(loading){
          
          if(originalPost === undefined){
            fetch(yujinserver+"/page/closet/"+authStore.currentId, { credentials: 'include', })
            .then(
              response => response.json(),
              error => console.error(error)
            )
            .then(json => {
              setClosetData(json.map((closet) => ({
                  selected: false,
                  closet: closet
              })))
              setLoading(false)
            })
          }
          else {
            setLoading(false)
          }
        }
      }, [loading])

      const submitPostWrite  = (data) => {
        const selectedClosetIds = closetData.filter((closet) => closet.selected).map((closet) => closet.closet.id)
        let form = new FormData()
        images.forEach((image) => {form.append("img", image)})

        fetch(yujinserver+"/post/img",{
            method: "POST",
            body: form,
            credentials: 'include',
          })
          .then(
            response => response.json(),
            error => console.error(error)
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
              error => console.error(error)
            )
            .then((json) => {
                if(json.postId !== undefined){
                  enqueueSnackbar("글 작성 완료!",{"variant": "success"});
                  dispatchPush("/community/post/"+json.postId)
                }
                else{
                  enqueueSnackbar("글 작성에 실패했습니다. 에러가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
                }
            })
          })
    }
  const submitPostEdit = (data) => {
    if(data.title !== originalPost.title || data.content !== originalPost.content){
      fetch(yujinserver+"/post/"+originalPost.id,{
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Cache': 'no-cache'
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })
      .then(
        response => response.text(),
        error => console.error(error)
      )
      .then((text) => {
        if(text === '수정완료'){
          enqueueSnackbar("게시물을 수정했습니다.",{"variant": "success"});
          dispatchPush("/community/post/"+originalPost.id)
        }
        else if(text === '없는 게시물!'){
          enqueueSnackbar("잘못된 접근입니다.",{"variant": "error"});
          backButtonAction()
        }
        else{
          enqueueSnackbar("게시물 수정에 실패했습니다. 에러가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
        }
      })
    }
    else{
      backButtonAction()
    }
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

    if(loading) return <Button disabled>옷장 공유하기</Button>
  else return(
        <Container maxWidth="md">
            <Grid component={Paper} className={classes.root}>
                <Grid item container>
                    <Typography className={classes.title} gutterBottom variant="h4">글쓰기</Typography>
                    <Button onClick={backButtonAction}>뒤로가기</Button>
                </Grid>
                <Divider />
                
                <form onSubmit={originalPost === undefined?handleSubmit(submitPostWrite):handleSubmit(submitPostEdit)}>
                    <TextField
                    inputRef={register({required: true})}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    defaultValue={originalPost !== undefined?originalPost.title:""}
                    id="title"
                    name="title"
                    label="제목"
                    autoComplete="title"
                    autoFocus
                    />
                    <TextField
                    inputRef={register({required: true})}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    defaultValue={originalPost !== undefined?originalPost.content:""}
                    id="content"
                    name="content"
                    label="내용"
                    multiline
                    rows={12}
                    />
                    {originalPost === undefined?(
                      <React.Fragment>
                        <ImageInput images={images} setImages={setImages} maxInput={3} />
                        <Box>
                        <GridList className={classes.gridList} cols={5}>
                            {closetComponentList}
                        </GridList>
                        </Box>
                      </React.Fragment>
                    ):(
                      originalPost.Pimgs.map((img) => {
                        return <Avatar src={img.img} className={classes.previewImage} variant="rounded" />
                      }) 
                    )}
                    <Button type="submit" fullWidth variant="contained" color="primary">Submit</Button>
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



const mapStateToProps = state => {
  const originalPost = state.router.location.state !== undefined? state.router.location.state.originalPost : undefined
  return({
    //pathname: state.router.location.pathname,
    //search: state.router.location.search,
    //hash: state.router.location.hash,
    authStore: state.auth,
    originalPost: originalPost
  })
}

const mapDispatchToProps = (dispatch) => ({
    backButtonAction: () => dispatch(goBack()),
    dispatchPush: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostWritePage)
