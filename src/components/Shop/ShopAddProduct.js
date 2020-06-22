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
import ImageInput from '../common/ImageInput'
import InputTable from './InputTable'

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
  const [ fetching, setFetching ] = useState(false)

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
    if(!fetching){
      if(category === "0"){
        enqueueSnackbar("상품 카테고리를 선택해주세요.",{"variant": "error"});
      }
      else if(data.gender === ""){
        enqueueSnackbar("상품 타겟 성별을 선택해주세요.",{"variant": "error"});
      }
      else if(colorArray.some((color) => color === "")){
        enqueueSnackbar("색상 입력란을 모두 적어주세요. 이름붙일 색상이 없어도 \"기본색\" 등의 이름을 붙여주세요.",{"variant": "error"});
      }
      else if(!disableSize && sizeArray.some((size) => size === "")){
        enqueueSnackbar("사이즈 입력란을 모두 적어주세요. 이름붙일 사이즈가 없어도 \"프리사이즈\" 등의 이름을 붙여주세요.",{"variant": "error"});
      }
      else if(quantityArray.some((quantityByColor) => quantityByColor.some((quantity) => quantity === ""))){
        enqueueSnackbar("재고를 모두 적어주세요. 해당하는 재고가 없으면 0을 입력하세요",{"variant": "error"});
      }
      else if(!(thumbnail.length && description.length && previews.length === colorArray.length)){
        enqueueSnackbar("이미지를 모두 첨부해주세요. 또 색상 개수와 누끼이미지 개수가 일치해야 합니다.",{"variant": "error"});
      }
      else{
        setFetching(true)
        let form = new FormData()
        form.append("photo", thumbnail[0])
        form.append("photo", description[0])
        previews.forEach((image) => {form.append("photo", image)})
        fetch(yujinserver+"/shop/img",{
          method: "POST",
          body: form,
          credentials: 'include',
        })
        .then(
          response => response.json(),
          error => console.error(error)
        )
        .then((images) => {
          const sending = sendByCategory(data, images)
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
            error => console.error(error)
          )
          .then((text) => {
            if(text === "add product success"){
              enqueueSnackbar("상품 등록에 성공했습니다.",{"variant": "success"});
              dispatchPush("/shop/mypage/")
            }
            else{
              enqueueSnackbar("상품 등록에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요",{"variant": "error"});
            }
            setFetching(false)
          })
        })
      }
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
            <FormControl component="fieldset" variant="outlined">
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
            <FormControl component="fieldset" variant="outlined">
              <FormLabel>성별</FormLabel>
              <RadioGroup row aria-label="gender" name="gender" >
                <FormControlLabel 
                inputRef={register()} value="M" control={<Radio />} label="남성" />
                <FormControlLabel 
                inputRef={register()} value="W" control={<Radio />} label="여성" />
                <FormControlLabel 
                inputRef={register()} value="U" control={<Radio />} label="남녀공용" />
              </RadioGroup>
            </FormControl>
            <InputTable 
            category={category} 
            colorArray={colorArray} 
            setColorArray={setColorArray} 
            sizeArray={sizeArray} 
            setSizeArray={setSizeArray} 
            quantityArray={quantityArray} 
            setQuantityArray={setQuantityArray} 
            disableSize={disableSize} 
            setDisableSize={setDisableSize} />
            <Box>
              <Typography>색상누끼이미지넣으세요</Typography>
              <ImageInput name="preview" images={previews} setImages={setPreviews} maxInput={MAX_COLOR_COUNT} />
            </Box>
            <Button disabled={fetching} type="submit" fullWidth variant="contained" color="primary">상품등록</Button>
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
