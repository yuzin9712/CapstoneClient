// "/product/:pid"에서 상품 상세정보 확인하는 페이지
import React, { useState, useEffect, } from 'react'
import PropTypes from 'prop-types'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { cleanOrderList, pushToOrderList } from '../../actions/orderList'
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Avatar,
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableRow,
  ButtonBase,
  TextField,
  Icon,
} from '@material-ui/core'
import {
  orange
} from '@material-ui/core/colors'
import {
  Delete as DeleteIcon, Store, PhotoCamera, Cancel, PinDrop, AddShoppingCart, AssignmentTurnedIn
} from '@material-ui/icons'

import ReviewCard from './ReviewCard';
import {sangminserver, yujinserver} from '../../restfulapi';
import { useForm, Controller } from 'react-hook-form'
import TryButton from './TryButton'
import ReviewWrite from './ReviewWrite'

const useStyles = makeStyles((theme) => ({
  avatarThumbnail: {
    width: '100%',
    height: '50vh'
  },
  textFieldQuantity: {
    width: '3em',
  },
  typoTotal: {
    width: '6em',
  },
  description: {
    alignSelf: 'center',
  }
}));

const ProductDetail = ({product, options, previews, pushToOrderList, cleanOrderList, push}) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar();
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedOptionComponent, setSelectedOptionComponent] = useState([])
  const [totalComponent, setTotalComponent] = useState(null)
  const [optionOpen, setOptionOpen] = useState(false)

  const optionMenuItem = options.map((option) => {
    return(
      <MenuItem onClick={() => addList(option)}>{option.color} / {option.size}</MenuItem>
  )})

  const addList = (option) => {
    if(!selectedOptions.some((selectedOption) => option.id === selectedOption.id)){
      setSelectedOptions([...selectedOptions, {
        ...option,
        quantity: 1
      }])
    }
  }

  const removeList = (id) => {
    setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption.id !== id))
  }

  const handleQuantityChange = (event, index) => {
    const value = event.target.value<1? 1 : event.target.value>100? 100: event.target.value
    let newArray = [...selectedOptions]
    newArray[index] = {...newArray[index], quantity: value}
    setSelectedOptions(newArray)
  }

  useEffect(() => {
    let total = 0
    setSelectedOptionComponent(selectedOptions.map((option, index) => {
      const preview = previews.find((preview) => preview.color === option.color)
      const subtotal = option.quantity * product.price
      total += subtotal
      return(
        <Box p={1} key={option.id}>
          <Box display="flex" alignItems="center" flexDirection="row">
            <Avatar src={preview.img} sizes="small"/>
            <Box flexGrow={1} component={Typography} variant="body2" gutterBottom>{option.color} / {option.size}</Box>
            <TextField 
              size="small"              
              className={classes.textFieldQuantity}
              value={option.quantity} 
              onChange={(event) => handleQuantityChange(event, index)} 
              type="number"
              inputProps={{
                style: { textAlign: "right" }, 
                min: "1", max: "100", step: "1"
              }}
            />
            <Typography variant="body2" gutterBottom align="right" className={classes.typoTotal}>{subtotal}원</Typography>
            <TryButton pid={product.id} previews={[preview]} />
            <IconButton onClick={() => removeList(option.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <Divider />
        </Box>
      )
    }))
    setTotalComponent(total?(
      <Box display="flex" flexDirection="row">
        <Box flexGrow={1} component={Typography} variant="body2" gutterBottom align="right">
          총합:
        </Box>
        <Typography variant="h6" gutterBottom align="right" color="primary" className={classes.typoTotal}>{total}원</Typography>
      </Box>
    ) : (null))
  }, [selectedOptions])

  const handleOptionOpen = () => {
    setOptionOpen(true)
  }
  const handleOptionClose = () => {
    setOptionOpen(false)
  }
  const purchaseThis = () => {
    if(!selectedOptions.length){
      handleOptionOpen()
    }
    else{
      cleanOrderList();
      selectedOptions.map((option) => {
        pushToOrderList({
          pid: product.id, 
          pname: product.pname, 
          color: option.color, 
          size: option.size, 
          quantity: option.quantity,
          price: product.price, 
          img: product.img
        });
      })
      push('/order/placeorder');
    }
  }
  const putItemIntoCart = async () => {
    if(!selectedOptions.length){
      handleOptionOpen()
    }
    else{
      selectedOptions.forEach((option) => {
        fetch(yujinserver+"/cart/"+product.id, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Cache': 'no-cache'
          },
          body: JSON.stringify({
            cnt: option.quantity,
            size: option.size,
            color: option.color,
          }),
          credentials: 'include',
        })
        .then(
          res => res.text(),
          err => {console.error(err);}
        )
        .then(text => {
          if(text === 'success'){
            enqueueSnackbar("장바구니담았어요",{"variant": "success"})
          }
        })
      })
    }
  }

  return(
    <Grid container>
      <Box p={3} alignItems="center" component={Grid} item xs={12} md={5}>
        <ButtonBase>
          <Avatar src={product.img} 
            variant="rounded"
            className={classes.avatarThumbnail}
          />
        </ButtonBase>
      </Box>
      <Box pl={3} component={Grid} item xs={12} md={7} conatiner direction="column">
        <Typography variant="body2" gutterBottom>{product.shopname}</Typography>
        <Typography variant="body1" gutterBottom>{product.pname}</Typography>
        <Typography variant="body1" gutterBottom color="primary" >{product.price}원</Typography>
        <Box py={2}>
          <FormControl variant="outlined" fullWidth className={classes.formControl}>
            <Select
              value=""
              displayEmpty
              open={optionOpen}
              onOpen={handleOptionOpen}
              onClose={handleOptionClose}
            >
              <MenuItem value="" disabled>
                옵션 선택
              </MenuItem>
              {optionMenuItem}
            </Select>
          </FormControl>
          {selectedOptionComponent}
          {totalComponent}
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <TryButton pid={product.id} previews={previews} fullButton variant="outlined" />
          <Button variant="outlined" onClick={putItemIntoCart}>
            <AddShoppingCart />장바구니
          </Button>
          <Button variant="outlined" onClick={purchaseThis}>
            <AssignmentTurnedIn />바로구매
          </Button>
        </Box>
      </Box>
      <Box p={3} flexGrow={1}>
        <Typography variant="h6" gutterBottom>상품상세정보</Typography>
        <Divider />
        <img src={product.description} alt={product.pname} />
      </Box>
    </Grid>
  )
}

ProductDetail.propTypes = {
  pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  pushToOrderList : (order) => dispatch(pushToOrderList(order)),
  cleanOrderList : () => dispatch(cleanOrderList()),
  push : (url) => dispatch(push(url)),
})
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail)