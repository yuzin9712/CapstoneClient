

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
} from '@material-ui/core'
import { yujinserver, sangminserver } from '../../restfulapi';
import ShopSubheader from './ShopSubheader';
import OrderList from './OrderList';
import { Link } from 'react-router-dom';
import { Edit } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({

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
      // console.log(editInfo)
      setOptionComponents(options.map((option) => 
        <Box display="flex" alignItems="center" p={1}>
          <Avatar src={(previews.find((preview) => preview.color === option.color)).img} variant="rounded" />
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
      ))
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
          (err) => console.error(error)
        )
        .then((text) => {
          if(text === 'update success'){
            enqueueSnackbar("성공이요",{"variant": "success", preventDuplicate: true});
            reload()
          }
          else{
            enqueueSnackbar("실패따리",{"variant": "error", preventDuplicate: true});
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
      if(text === "success"){
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
      <Box width={1/2} display="flex" alignItems="center" p={1}>
        <Box flexGrow={1} display="flex" flexDirection="row" alignItems="center" >
          <ButtonBase component={Link} to={"/productDetail/"+product.id}>
            <Avatar src={product.img} variant="rounded" />
            <Box px={1} component={Typography} gutterBottom variant="body1">{product.pname}</Box>
          </ButtonBase>
        </Box>
        <Box px={1} component={Typography} gutterBottom variant="body2">{product.price}원</Box>
        <Tooltip title="수정">
          <ButtonBase onClick={handleOpen}>
            <Edit />
          </ButtonBase>
        </Tooltip>
      </Box>
      <Dialog 
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="design-write-dialog"
      >
        <DialogTitle>상품정보 수정</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>재고 수정하세요</Typography>
          {optionComponents}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
          <Button variant="contained" color="warning" onClick={deleteProduct}>상품 삭제</Button>
          <Button onClick={submitQuantity}>재고 수정</Button>
        </DialogActions>
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
