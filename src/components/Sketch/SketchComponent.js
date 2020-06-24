// https://codesandbox.io/s/8k7kvwqx70
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Grid, Box, Button, ButtonBase, Avatar, Tooltip, IconButton, TextField, Popover, Typography, Dialog, Divider,
} from '@material-ui/core'
import { sangminserver, yujinserver } from '../../restfulapi';
import { sketchResetItems, sketchRemoveItem, handleDrawerClose } from '../../actions/sketch';
import { AddShoppingCart, SaveAlt, Remove, Delete, Palette, ChevronLeft, Help, Close } from '@material-ui/icons';
import { brown, yellow, grey, red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, amber, orange, deepOrange, blueGrey } from '@material-ui/core/colors';
import { useSnackbar } from 'notistack';
import grid from '../../../public/grid.png'
import {GithubPicker} from 'react-color'
import { push } from 'connected-react-router';
import queryString from 'query-string'
import SketchGuide from './SketchGuide';
import costume_tuto1 from '../../../public/costume_tuto1.png'
import costume_tuto2 from '../../../public/costume_tuto2.png'
import costume_tuto3 from '../../../public/costume_tuto3.png'
// import fabric from 'fabric'
const fabric = window.fabric
const OBJECT_COUNT_MAX = 25

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(65),
    height: '100vh',
  },
  paletteImage: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  list: {
    alignItems: 'flex-start',
    overflowY: "scroll",
  },
  floatingButtonBox: {
    position: "absolute",
    bottom: '1px',
    right: '1px',
    '& > *': {
      padding: '1px',
    },
  },
  cartButton: {
    border: "1px solid white",
    backgroundColor: "white",
    borderRadius: "50%",
  },
  removeButton: {
    border: "1px solid white",
    backgroundColor: "white",
    borderRadius: "50%",
  },
  dialogImage: {
    width: '100%',
    height: '100%',
  },
}));

const SketchComponent = ({ sketchItems, sketchResetItems, sketchRemoveItem, authStore, pathname, search, push, handleDrawerClose, history }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [canvas, setCanvas] = useState(null)
  const [ sketchItemComponents, setSketchItemComponents ] = useState(null)
  const [dragInfo, setDragInfo] = useState({
    drag: false,
    pid: 1,
    src: "",
    cursorX: 0,
    cursorY: 0,
  })
  const [guideOpen, setGuideOpen] = useState(false)
  const backgroundCanvas = new fabric.StaticCanvas()
  const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null);
  const [canvasColor, setCanvasColor] = useState(grey[100])
  const open = Boolean(colorPickerAnchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleCanvasColor = (color, event) => {
    setCanvasColor(color.hex)
    // fabric.Image.fromURL(grid,(background) => {
    //   backgroundCanvas.setWidth(175)
    //   backgroundCanvas.setHeight(175)
    //   backgroundCanvas.add(background)
    //   backgroundCanvas.setBackgroundColor(color.hex, () => backgroundCanvas.renderAll())

    //   const pattern = new fabric.Pattern({
    //     source: backgroundCanvas.getElement(),
    //     repeat: 'repeat'
    //   })
    //   canvas.setBackgroundColor(pattern, () => {canvas.renderAll()})
    // })
  }
  const openColorPicker = (event) => {
    setColorPickerAnchorEl(event.currentTarget)
  }
  const closeColorPicker = () => {
    setColorPickerAnchorEl(null)
  }
  useEffect(() => {
    if(canvas !== null){
      fabric.Image.fromURL("",(background) => {
        // backgroundCanvas.setWidth(1)
        // backgroundCanvas.setHeight(1)
        // backgroundCanvas.add(background)
        backgroundCanvas.setBackgroundColor(canvasColor, () => backgroundCanvas.renderAll())
  
        const pattern = new fabric.Pattern({
          source: backgroundCanvas.getElement(),
          repeat: 'repeat'
        })
        canvas.setBackgroundColor(pattern, () => {canvas.renderAll()})
      })
    }
  }, [canvasColor, canvas])

  useEffect(() => {
    if(canvas === null) {
      const fabricCanvas = new fabric.Canvas("canvasRef")
      // fabric.Image.fromURL(grid,(background) => {
      //   backgroundCanvas.setWidth(175)
      //   backgroundCanvas.setHeight(175)
      //   backgroundCanvas.add(background)
      //   backgroundCanvas.setBackgroundColor(grey[50], () => backgroundCanvas.renderAll())

      //   const pattern = new fabric.Pattern({
      //     source: backgroundCanvas.getElement(),
      //     repeat: 'repeat'
      //   })
      //   fabricCanvas.setBackgroundColor(pattern, () => {fabricCanvas.renderAll()})
      // })
      fabricCanvas.on({
        'selection:updated': () => fabricCanvas.bringToFront(fabricCanvas.getActiveObject()),
        'selection:created': () => fabricCanvas.bringToFront(fabricCanvas.getActiveObject()),
      })
      fabricCanvas.setWidth(theme.spacing(63))
      fabricCanvas.setHeight(theme.spacing(50))
      setCanvas(fabricCanvas)
    }
  }, [canvas])

  useEffect(() => {
    if(sketchItems.length !== 0){
      setSketchItemComponents(sketchItems.map((product) => {
          return(
              <Box p={1} position="relative">
                <Avatar alt={product.pid} draggable={true} className={classes.paletteImage} src={product.src} variant="rounded" onDragStart={handleDragStart} />
                <Box p={1} className={classes.floatingButtonBox}>
                  <Tooltip title="장바구니담기">
                    <ButtonBase disableRipple onClick={() => storebasket(product)}>
                      <AddShoppingCart className={classes.cartButton} />
                    </ButtonBase>
                  </Tooltip>
                  <Tooltip title="제외하기">
                    <ButtonBase disableRipple onClick={() => sketchRemove(product)}>
                      <Delete className={classes.removeButton} />
                    </ButtonBase>
                  </Tooltip>
                </Box>
              </Box>
          )
      }))
    }
    else{
      setSketchItemComponents(
        <Box>
          <Typography>상품 목록👔이나 추천코디💎, 커뮤니티👀에서</Typography>
          <Typography><Palette /> 아이콘을 찾아 여기에 상품을 올려보세요.</Typography>
        </Box>
      )
    }
  }, [sketchItems, pathname, search])

  const storebasket = (product) => { //버튼클릭하면 해당 상품 장바구니 DB로 연결
    fetch(sangminserver+'/cart/toolbar',{
      method: "POST",
      body: JSON.stringify({
        color: product.color,
        pid: product.pid,
      }),
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        'Cache': 'no-cache'
      },
      credentials: 'include'
    })
    .then((res) => res.text())
    .then((text) => {
      if(text === "success"){
        if(pathname.startsWith('/order/cart')){
          push('/order/cart', {reload: true})
        }
        enqueueSnackbar("장바구니에 넣었습니다.",{"variant": "success", action: () => <Button onClick={() => push("/order/cart")}>바로가기</Button>});
      }
      else{
        enqueueSnackbar("장바구니에 넣지 못했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
      }
    })
  }
  const sketchRemove = (product) => {
    sketchRemoveItem(product.src)
  }

  const restart = () => {
    sketchResetItems()
  }
  const removeAll = () => {
    canvas.getObjects().forEach((img) => {
      canvas.remove(img)
    })
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }
  const removeSelected = () => {
    canvas.getActiveObjects().forEach((obj) => canvas.remove(obj))
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }
  const saveCloset = () => {
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    const objects = canvas.toJSON().objects
    if(objects.length === 0){
      enqueueSnackbar("저장할 내용이 없습니다.",{"variant": "error"});
    }
    else {
      const products = objects.reduce((result, obj) => {
        if(!result.some((pid) => pid === obj.pid)) result.push(obj.pid)
        return result
      }, [])
      const formData = new FormData()
      document.getElementById("canvasRef").toBlob((blob) => {
        formData.append('image',blob)
        fetch(yujinserver+'/closet/img',{
          method: 'POST',
          body: formData,
          'content-type':'multipart/form-data',
          credentials: 'include',
        })
        .then(
          res => res.json(),
          error => console.error(error)
        )
        .then((image) => {
          fetch(yujinserver+'/closet/',{
            method: "POST",
            headers: {
              'Accept': 'application/json',
              "Content-Type": "application/json",
              'Cache': 'no-cache'
            },
            body: JSON.stringify({
              image: image,
              products: products
            }),
            credentials: 'include',
          })
          .then(
            res => res.text(),
            error => console.error(error)
          )
          .then((text) => {
            if(text === "success"){
              if(queryString.parse(search).page === "closet"){
                push("/mypage/"+authStore.currentId+"?page=closet", {reload: true})
              }
              enqueueSnackbar("작업을 나의옷장에 저장했습니다.",{"variant": "success", action: () => (
                <Button onClick={() => push("/mypage/"+authStore.currentId+"?page=closet")}>
                  <Typography variant="button" color="textSecondary">바로가기</Typography>
                </Button>
              )});
            }
            else{
              enqueueSnackbar("작업을 저장하지 못했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error"});
            }
          })
        })
      })
    }
  }

  const handleDrop = (event) => {
    if(dragInfo.drag){
      if(canvas.toJSON().objects.length >= OBJECT_COUNT_MAX){
        enqueueSnackbar("이 이상 올릴 수 없습니다.",{"variant": "error"});
      }
      else{
        const x = event.clientX - canvas._offset.left
        const y = event.clientY - canvas._offset.top
        fabric.Image.fromURL(dragInfo.src, img => {
          img.toObject = () => ({pid: dragInfo.pid, src: dragInfo.src})
          canvas.add(img)
          img.scaleToWidth(100)
          img.set({borderColor: 'black', cornerColor: 'black'})
        }, {
          left: x - dragInfo.x,
          top: y - dragInfo.y,
        })
        setDragInfo({
          ...dragInfo,
          drag: false
        })
      }
    }
  }
  const handleDragStart = (event) => {
    const imageDOMRect = event.target.getBoundingClientRect()
    setDragInfo({
      drag: true,
      pid: event.target.alt,
      src: event.target.src,
      x: event.clientX - imageDOMRect.left,
      y: event.clientY - imageDOMRect.top,
    })
  }

  return(
    <>
      <Box display="flex" flexDirection="column" className={classes.root}>
        <Box p={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Button variant="outlined" onClick={() => handleDrawerClose()}>
            <ChevronLeft /> 닫기
          </Button>
          <Box display="flex" flexDirection="row">
            <Button variant="outlined" onClick={() => push("/mypage/"+authStore.currentId+"?page=closet")}>
              ✨나의옷장
            </Button>
            <Box pr={1} />
            <Button variant="outlined" onClick={() => setGuideOpen(true)}>
              <Help /> 사용법
            </Button>
            <Box pr={1} />
            <Button onClick={openColorPicker} style={{backgroundColor: canvasColor}}>
              🌈 배경색
            </Button>
          </Box>
        </Box>
        <Box px={1} onDrop={handleDrop}>
          <canvas id="canvasRef" />
        </Box>
        <Box p={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Button variant="contained" color="primary" onClick={saveCloset}><SaveAlt />나의옷장에 저장</Button>
          <Box display="flex" flexDirection="row">
            <Button variant="outlined" onClick={removeAll}>전체삭제</Button>
            <Box pr={1} />
            <Button variant="outlined" onClick={removeSelected}>선택삭제</Button>
          </Box>
        </Box>
        <Divider variant="middle" />
        <Box p={1} flexGrow={1} display="flex" flexDirection="column">
          <Box flexGrow={1} display="flex" flexDirction="row" flexWrap="wrap" alignItems="flex-start" alignContent="flex-start" className={classes.list}>
            {sketchItemComponents}
          </Box>
          <Button fullWidth variant="outlined" onClick={restart}>리스트 초기화</Button>
        </Box>
      </Box>
      <Popover
      id={id}
      open={open}
      anchorEl={colorPickerAnchorEl}
      onClose={closeColorPicker}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}>
        <GithubPicker 
          colors={[red[100], pink[100], purple[100], deepPurple[100], indigo[100], blue[100], lightBlue[100], 
            cyan[100], teal[100], green[100], lightGreen[100], lime[100], yellow[100], amber[100], orange[100], deepOrange[100], 
            brown[100], grey[100], blueGrey[100], ]}
          onChangeComplete={handleCanvasColor}
        />
      </Popover>
      <Dialog
      fullWidth
      maxWidth="md"
      open={guideOpen}
      onClose={() => setGuideOpen(false)}>
        <Box p={1} display="flex" flexDirection="column">
          <Box p={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box px={1} fontSize="h6.fontSize" >코디 툴 사용 가이드</Box>
            <Tooltip title="닫기">
              <IconButton onClick={() => setGuideOpen(false)}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider variant="middle" />
          <SketchGuide interval={10000} >
            <Box p={1} display="flex" flexDirection="column">
              <Avatar src={costume_tuto1} className={classes.dialogImage} variant="rounded" />
              <Box p={1} textAlign="center" alignItems="center"><Palette /> 버튼으로 상품을 담고 캔버스에 드래그해 원하는 상품으로 코디해보세요!</Box>
            </Box>
            <Box p={1} display="flex" flexDirection="column">
              <Avatar src={costume_tuto2} className={classes.dialogImage} variant="rounded" />
              <Box p={1} textAlign="center" alignItems="center">코디 툴에서 마음에 든 상품은 <AddShoppingCart /> 버튼으로 곧바로 장바구니에!</Box>
            </Box>
            <Box p={1} display="flex" flexDirection="column">
              <Avatar src={costume_tuto3} className={classes.dialogImage} variant="rounded" />
              <Box p={1} textAlign="center" alignItems="center">코디를 저장하면 ✨나의옷장에서 사용된 상품과 함께 확인할 수 있어요!</Box>
            </Box>
          </SketchGuide>
        </Box>
      </Dialog>
    </>
  )
}

SketchComponent.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  sketchItems: state.sketch.list,
  authStore: state.auth,
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  sketchResetItems: () => dispatch(sketchResetItems()),
  sketchRemoveItem: (src) => dispatch(sketchRemoveItem(src)),
  push: (url, props) => dispatch(push(url, props)),
  handleDrawerClose: () => dispatch(handleDrawerClose()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SketchComponent)