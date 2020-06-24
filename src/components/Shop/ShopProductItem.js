

// "/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, 
  Avatar, 
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ButtonBase,
  Tooltip,
  Divider,
} from '@material-ui/core'
import { yujinserver, sangminserver } from '../../restfulapi';
import ShopSubheader from './ShopSubheader';
import OrderList from './OrderList';
import { Link } from 'react-router-dom';
import { Edit } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  productImage: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const ShopProductItem = ({product, options, previews, reload}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [editInfo, setEditInfo] = useState([])
  const [optionComponents, setOptionComponents] = useState([])
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)
  const initialQuantity = []

  useEffect(() => {
    setEditInfo(options.reduce((result, option) => {
      // if(!result[option.id]) result[option.id] = {}
      result = {
        ...result,
        [option.optionId]: {
          edited: false,
          quantity: option.cnt
        }
      }
      initialQuantity[option.optionId] = option.cnt
      // result[option.id] = {
      //   edited: false,
      //   quantity: option.cnt
      // }
      return result
    }, {}))
  }, [options])

  useEffect(() => {
    if(editInfo.length !== 0){
      setOptionComponents(options.map((option) => {
        const preview = (previews.find((preview) => preview.color === option.color))
        return(
          <Box display="flex" alignItems="center" p={1}>
            <Avatar src={preview !== undefined? preview.img: ''} variant="rounded" />
            <Box flexGrow={1} component={Typography} gutterBottom variant="body1">{option.color} / {option.size}:</Box>
            <Typography gutterBottom variant="body1" align="right">{option.cnt}개 → </Typography>
            <TextField 
            size="small" 
            className={classes.textFieldQuantity}
            type="number"
            value={editInfo[option.optionId].quantity}
            onChange={(event) => handleChange(event, option.optionId)}
            inputProps={{
              style: { textAlign: "right" },
              min: "1", max: "10000", step: "1",
            }}
            />
          </Box>
        )
      }))
    }
  }, [editInfo])

  const handleChange = (event, optionId) => {
    const value = event.target.value<1? 1 : event.target.value>10000? 10000: event.target.value
    setEditInfo({
        ...editInfo,
        [optionId]: {
          edited: (value !== initialQuantity[optionId]),
          quantity: value
        }
    })
  }
  
  const submitQuantity = () => {
    Object.keys(editInfo).forEach((optionId) => {
      if(editInfo[optionId].edited){
        fetch(sangminserver+'/shop/updateCntBySeller',{
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Cache': 'no-cache'
          },
          body: JSON.stringify({
              productInfo: {
                productId: optionId,
                cnt: editInfo[optionId].quantity
              },
          }),
          credentials: 'include',
        })
        .then(
          (res) => res.text(),
          (error) => console.error(error)
        )
        .then((text) => {
          if(text === 'update success'){
            enqueueSnackbar("등록된 재고를 수정했습니다.",{"variant": "success", preventDuplicate: true});
            reload()
          }
          else{
            enqueueSnackbar("재고 수정 작업에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.",{"variant": "error", preventDuplicate: true});
          }
        })
      }
    })
  }

  const deleteProduct = () => {
    fetch(yujinserver+'/shop/deleteProductBySeller',{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        'Cache': 'no-cache'
      },
      body: JSON.stringify({
          productId: product.id
      }),
      credentials: 'include',
    })
    .then(
      (res) => res.text(),
      (error) => console.error(error)
    )
    .then((text) => {
      if(text === "delete product success"){
        enqueueSnackbar(product.pname+": 삭제했습니다.",{"variant": "success"});
        reload()
      }
      else{
        enqueueSnackbar("삭제하지 못했습니다. 관리자에게 문의해주세요",{"variant": "error"});
      }
    })
  }

  return(
    <React.Fragment>
      <Box width={1/2} display="flex" alignItems="center" p={1} component={Button} onClick={handleOpen}>
        <Box flexGrow={1} display="flex" flexDirection="row" alignItems="center" >
          <Avatar src={product.img} variant="rounded" />
          <Box px={1} component={Typography} gutterBottom variant="body1">{product.pname}</Box>
        </Box>
        <Box px={1} component={Typography} gutterBottom variant="body2">{product.price}원</Box>
        <Edit />
      </Box>
      <Dialog 
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="design-write-dialog"
      >
        <Box display="flex" flexDirection="column" p={1}>
          <Box display="flex" flexDirection="row" flexWrap="wrap" alignItems="center">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Avatar src={product.img} variant="rounded" className={classes.productImage} />
              <Box px={1} component={Typography} gutterBottom variant="h5">{product.pname}</Box>
            </Box>
            <Box flexGrow={1} display="flex" justifyContent="flex-end" alignItems="center">
              <Button variant="outlined" component={Link} to={'/productDetail/'+product.id}>상품 판매 페이지</Button>
            </Box>
          </Box>
          <Divider />
          <Box py={1}>
            <Typography gutterBottom variant="h6">재고 수정</Typography>
            {optionComponents}
          </Box>
          <Divider />
          <Box pt={1} display="flex" flexDirection="row" justifyContent="flex-end">
            <Box ml={1} component={Button} variant="outlined" onClick={handleClose}>닫기</Box>
            <Box ml={1} component={Button} variant="outlined" onClick={deleteProduct}>상품 삭제</Box>
            <Box ml={1} component={Button} variant="outlined" onClick={submitQuantity}>재고 수정</Box>
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  )
}

ShopProductItem.propTypes = {
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
  
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopProductItem)
