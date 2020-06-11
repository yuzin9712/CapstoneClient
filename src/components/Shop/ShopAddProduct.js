// "/shop/productupload"에서 상품등록
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
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  FormLabel,
  Table,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core'
import { PhotoCamera, Cancel, Check, Add, Remove } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form'
import clsx from 'clsx'
import { useSnackbar } from 'notistack'
import { yujinserver } from '../../restfulapi'
import ShopSubheader from './ShopSubheader'
import ImageInput from '../Product/ImageInput'

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

const MAX_SIZE_COUNT = 8
const MAX_COLOR_COUNT = 4

const ShopAddProduct = ({backButtonAction, dispatchPush}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit } = useForm();

  const [ previews, setPreviews ] = useState([]);
  const [thumbnail, setThumbnail] = useState([])
  const [description, setDescription] = useState([])

  const [category, setCategory] = useState("0")
  const [colorArray, setColorArray] = useState([""])
  const [sizeArray, setSizeArray] = useState([""])
  const [quantityArray, setQuantityArray] = useState([[""]])
  const [disableSize, setDisableSize] = useState(false)
  
  const sendByCategory = (data, images) => {
    switch(category){
      case "1":
      case "2": {
        const quantityBySize = quantityArray.reduce((result, quantityByColor) => {
          return({
            S: [...result.S, quantityByColor[0]],
            M: [...result.M, quantityByColor[1]],
            L: [...result.L, quantityByColor[2]],
            XL: [...result.XL, quantityByColor[3]],
          })
        }, {S: [], M: [], L: [], XL: []})
        return JSON.stringify({
          ...data,
          categoryId: category,
          color: colorArray,
          S: quantityBySize.S,
          M: quantityBySize.M,
          L: quantityBySize.L,
          XL: quantityBySize.XL,
          photo: images
        })
      }
      case "3": // 패션잡화: 사이즈없음
        return JSON.stringify({
          ...data,
          categoryId: category,
          color: colorArray,
          cnt: quantityArray.map((quantityByColor) => quantityByColor[0]),
          photo: images
        })
      case "4": // 신발: 사이즈도 입력
        return JSON.stringify({
          ...data,
          categoryId: category,
          size: sizeArray,
          color: colorArray,
          cnt: quantityArray.reduce((result, quantityByColor) => {
            return [...result, ...quantityByColor]
          }, []),
          photo: images
        })
      default: return "error"
    }
  }

  const productSubmit = (data) => {
    if(thumbnail.length && description.length){
      let form = new FormData()
      form.append("photo", thumbnail[0])
      form.append("photo", description[0])
      previews.forEach((image) => {form.append("photo", image)})
      console.log(data)
      fetch(yujinserver+"/shop/img",{
        method: "POST",
        body: form,
        credentials: 'include',
      })
      .then(
        response => response.json(),
        error => console.log(error)
      )
      .then((images) => {
        const sending = sendByCategory(data, images)
        console.log(sending)
        fetch(yujinserver+"/shop/addproduct",{
            method: "POST",
            headers: {
              'Accept': 'application/json',
              "Content-Type": "application/json",
              'Cache': 'no-cache'
            },
            body: sending,
            credentials: 'include',
        })
        .then(
          response => response.text(),
          error => console.log(error)
        )
        .then((text) => {
            if(text === "add product success"){
                enqueueSnackbar("성공이요",{"variant": "success"});
                dispatchPush("/shop/mypage/")
            }
            else{
                enqueueSnackbar("실패따리",{"variant": "error"});
            }
            console.log(text)
        })
      })
    }
  }
  
  useEffect(() => {
    switch(category){
      case "1":
      case "2": { 
        setSizeArray(["S", "M", "L", "XL"])
        setQuantityArray(colorArray.map((quantityByColor) => ["", "", "", ""]))
        setDisableSize(true)
        break
      }
      case "3": { // 패션잡화: 사이즈없음
        setSizeArray([""])
        setQuantityArray(colorArray.map((quantityByColor) => [""]))
        setDisableSize(true)
        break
      }
      case "4": { // 신발: 사이즈도 입력
        setDisableSize(false)
        break
      }
      default: {}
    }
  }, [category])

  

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  }
  const handleSizeChange = (event, index) => {
    const newArray = [...sizeArray]
    newArray[index] = event.target.value
    setSizeArray(newArray)
  }
  const handleColorChange = (event, index) => {
    const newArray = [...colorArray]
    newArray[index] = event.target.value
    setColorArray(newArray)
  }
  const handleQuantityChange = (event, colorIndex, sizeIndex) => {
    const newArray = [...quantityArray]
    newArray[colorIndex][sizeIndex] = event.target.value
    setQuantityArray(newArray)
  }
  const handleSizeAdd = () => {
    setSizeArray([...sizeArray, ""])
    setQuantityArray(quantityArray.map((quantityByColor) => [...quantityByColor, ""]))
  }
  const handleColorAdd = () => {
    if(colorArray.length < MAX_COLOR_COUNT){
      setColorArray([...colorArray, ""])
      setQuantityArray([...quantityArray, sizeArray.reduce((result) => {
        result = [...result, ""]
        return result
      },[])])
    }
  }
  const handleSizeRemove = (sizeIndex) => {
    setSizeArray([...sizeArray.slice(0,sizeIndex), ...sizeArray.slice(sizeIndex+1)])
    setQuantityArray(quantityArray.map((quantityByColor) => [...quantityByColor.slice(0,sizeIndex), ...quantityByColor.slice(sizeIndex+1)]))
  }
  const handleColorRemove = (colorIndex) => {
    setColorArray([...colorArray.slice(0,colorIndex), ...colorArray.slice(colorIndex+1)])
    setQuantityArray([...quantityArray.slice(0,colorIndex), ...quantityArray.slice(colorIndex+1)])
  }

  const inputTable = (
    <Table className={clsx({
      [classes.hide]: category === "0"
    })}>
      <TableRow className={clsx({
        [classes.hide]: category === "3"
      })}>
        <TableCell />
        {sizeArray.map((size, sizeIndex) => {
          return (
            <TableCell>
              <Tooltip title="사이즈 삭제~" className={clsx({
                [classes.hide]: sizeArray.length <= 1 || disableSize
              })}>
                <IconButton size="small" onClick={() => handleSizeRemove(sizeIndex)}>
                  <Remove />
                </IconButton>
              </Tooltip>
              <TextField
              disabled={disableSize}
              variant="outlined"
              id="size"
              size="small"
              value={size}
              onChange={(event) => handleSizeChange(event, sizeIndex)}
              label={"사이즈"} />
            </TableCell>
          )
        })}
        <TableCell rowSpan={colorArray.length+1} className={clsx({
          [classes.hide]: sizeArray.length >= MAX_SIZE_COUNT || disableSize
        })}>
          <Tooltip title="사이즈 추가">
            <IconButton onClick={handleSizeAdd}>
              <Add />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {colorArray.map((color, colorIndex) => {
        return <TableRow>
          <Box display="flex" alignItems="center" component={TableCell}>
              <Tooltip title="색상 삭제~" className={clsx({
                [classes.hide]: colorArray.length <= 1
              })}>
                <IconButton size="small" onClick={() => handleColorRemove(colorIndex)}>
                  <Remove />
                </IconButton>
              </Tooltip>
              <Box flexGrow={1} component={TextField}
              variant="outlined"
              id="color"
              size="small"
              value={color}
              onChange={(event) => handleColorChange(event, colorIndex)}
              label={"색상"} />
            </Box>
          {quantityArray[colorIndex].map((quantity, sizeIndex) => {
            return <TableCell component={TextField} 
            variant="outlined"
            id="quantity"
            size="small"
            value={quantity}
            onChange={(event) => handleQuantityChange(event, colorIndex, sizeIndex)}
            label={"재고"} />
          })}
        </TableRow>
      })}
      <TableRow className={clsx({
        [classes.hide]: colorArray.length >= MAX_COLOR_COUNT
      })}>
        <TableCell colSpan={sizeArray.length+1}>
          <Tooltip title="색상 추가~">
            <IconButton onClick={handleColorAdd}>
              <Add />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </Table>
  )
    
  return(
    <Container maxWidth="md">
      <Grid container={Paper} className={classes.root}>
        <ShopSubheader />
        <Grid item container>
          <Typography className={classes.title} gutterBottom variant="h4">관리자 올리기</Typography>
          <Button onClick={backButtonAction}>돌아가</Button>
        </Grid>
        <Divider />
        <form onSubmit={handleSubmit(productSubmit)}>
          <Grid container direction="column">
            <TextField
            inputRef={register({required: true})}
            variant="outlined"
            margin="normal"
            required
            id="productname"
            name="productname"
            label="상품명"
            autoFocus
            />
            <TextField
            inputRef={register({required: true})}
            variant="outlined"
            margin="normal"
            required
            id="price"
            name="price"
            type="number"
            label="가격"
            />
            <Box>
              <Typography>썸네일넣으세요</Typography>
              <ImageInput name="thumbnail" images={thumbnail} setImages={setThumbnail} maxInput={1} />
            </Box>
            <Box>
              <Typography>상세이미지넣으세요</Typography>
              <ImageInput name="description" images={description} setImages={setDescription} maxInput={1} />
            </Box>
            <FormControl required component="fieldset" variant="outlined">
              <FormLabel>카테고리</FormLabel>
              <RadioGroup row aria-label="categoryId" name="categoryId" value={category} onChange={handleCategoryChange}>
                <FormControlLabel 
                value="1" control={<Radio />} label="상의" />
                <FormControlLabel 
                value="2" control={<Radio />} label="하의" />
                <FormControlLabel 
                value="3" control={<Radio />} label="패션잡화" />
                <FormControlLabel 
                value="4" control={<Radio />} label="신발" />
              </RadioGroup>
            </FormControl>
            <FormControl required component="fieldset" variant="outlined">
              <FormLabel>성별</FormLabel>
              <RadioGroup row aria-label="gender" name="gender" >
                <FormControlLabel 
                inputRef={register({required: true})} value="M" control={<Radio />} label="남성" />
                <FormControlLabel 
                inputRef={register({required: true})} value="W" control={<Radio />} label="여성" />
                <FormControlLabel 
                inputRef={register({required: true})} value="U" control={<Radio />} label="남녀공용" />
              </RadioGroup>
            </FormControl>
            {inputTable}
            <Box>
              <Typography>색상누끼이미지넣으세요</Typography>
              <ImageInput name="preview" images={previews} setImages={setPreviews} maxInput={MAX_COLOR_COUNT} />
            </Box>
            <Button type="submit" fillWidth variant="contained" color="primary">Submit</Button>
          </Grid>
        </form>
      </Grid>
    </Container>
  )
}

ShopAddProduct.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopAddProduct)
