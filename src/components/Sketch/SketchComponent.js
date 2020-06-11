// https://codesandbox.io/s/8k7kvwqx70
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, Button, ButtonBase, Avatar, Tooltip, IconButton, TextField, Popover, Typography,
} from '@material-ui/core'
import { sangminserver, yujinserver } from '../../restfulapi';
import { sketchResetItems, sketchRemoveItem } from '../../actions/sketch';
import { AddShoppingCart, SaveAlt, Remove, Delete, Palette } from '@material-ui/icons';
import { brown, yellow, grey, red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, amber, orange, deepOrange, blueGrey } from '@material-ui/core/colors';
import { useSnackbar } from 'notistack';
import grid from '../../../public/grid.png'
import {GithubPicker} from 'react-color'
// import fabric from 'fabric'
const fabric = window.fabric
const OBJECT_COUNT_MAX = 25

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh'
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
}));

const SketchComponent = ({ sketchItems, sketchResetItems, sketchRemoveItem }) => {
  const classes = useStyles();
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
        backgroundCanvas.setWidth(175)
        backgroundCanvas.setHeight(175)
        backgroundCanvas.add(background)
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
      fabricCanvas.setWidth(536)
      fabricCanvas.setHeight(400)
      setCanvas(fabricCanvas)
    }
  }, [canvas])

  useEffect(() => {
    if(sketchItems.length !== 0){
      setSketchItemComponents(sketchItems.map((product) => {
        // console.log(product.pid)
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
        <Typography gutterBottom variant="h5">없어요</Typography>
      )
    }
  }, [sketchItems])

  const storebasket = (product) => { //버튼클릭하면 해당 상품 장바구니 DB로 연결
    // console.log(product);
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
        enqueueSnackbar("장바구니 넣었어요",{"variant": "success"});
      }
      else{
        enqueueSnackbar("실패따리",{"variant": "error"});
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
  }
  const removeSelected = () => {
    canvas.getActiveObjects().forEach((obj) => canvas.remove(obj))
    canvas.discardActiveObject()
  }
  const saveCloset = () => {
    canvas.discardActiveObject()
    const objects = canvas.toJSON().objects
    if(objects.length === 0){
      enqueueSnackbar("아무것도 없어요",{"variant": "error"});
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
          err => console.error(err)
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
            err => console.error(err)
          )
          .then((text) => {
            if(text === "success"){
              enqueueSnackbar("나의옷장 저장이요",{"variant": "success"});
            }
            else{
              enqueueSnackbar("실패따리",{"variant": "error"});
            }
          })
        })
      })
    }
  }

  const handleDrop = (event) => {
    if(dragInfo.drag){
      if(canvas.toJSON().objects.length >= OBJECT_COUNT_MAX){
        enqueueSnackbar("그만올립시다",{"variant": "error"});
      }
      else{
        const x = event.clientX - canvas._offset.left
        const y = event.clientY - canvas._offset.top
        fabric.Image.fromURL(dragInfo.src, img => {
          img.toObject = () => ({pid: dragInfo.pid, src: dragInfo.src})
          canvas.add(img)
          img.scaleToWidth(100)
          img.set({borderColor: 'black', cornerColor: 'black'})
          // console.log(canvas.toJSON().objects)
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
    <Box display="flex" flexDirection="column" className={classes.root}>
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Button variant="contained" color="primary" onClick={saveCloset}><SaveAlt />나의옷장에 저장</Button>
        <Button variant="contained" color="secondary" onClick={removeAll}>전체삭제</Button>
        <Button variant="outlined" onClick={removeSelected}>선택삭제</Button>
        <Tooltip title="배경색">
          <IconButton onClick={openColorPicker} style={{backgroundColor: canvasColor}}>
            🌈
          </IconButton>
        </Tooltip>
        <Popover
        id={id}
        open={open}
        anchorEl={colorPickerAnchorEl}
        onClose={closeColorPicker}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigirn={{vertical: 'top', horizontal: 'left'}}>
          <GithubPicker 
            colors={[red[100], pink[100], purple[100], deepPurple[100], indigo[100], blue[100], lightBlue[100], 
              cyan[100], teal[100], green[100], lightGreen[100], lime[100], yellow[100], amber[100], orange[100], deepOrange[100], 
              brown[100], grey[100], blueGrey[100], ]}
            onChangeComplete={handleCanvasColor}
          />
        </Popover>
      </Box>
      <Box p={1} onDrop={handleDrop}>
        <canvas id="canvasRef" />
        {/* {canvasComponent} */}
      </Box>
      <Box p={1} flexGrow={1} component={Grid} container className={classes.list}>
        {sketchItemComponents}
      </Box>
      <Button variant="outlined" onClick={restart}>리스트 초기화</Button>
    </Box>
  )
}

SketchComponent.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  sketchItems: state.sketch.list
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  sketchResetItems: () => dispatch(sketchResetItems()),
  sketchRemoveItem: (src) => dispatch(sketchRemoveItem(src)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SketchComponent)