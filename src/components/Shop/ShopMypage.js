// "/shop/mypage"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, 
  Box,
  Container,
} from '@material-ui/core'
import ShopSubheader from './ShopSubheader';
import { yujinserver } from '../../restfulapi';
import ShopProductList from './ShopProductList';

const useStyles = makeStyles((theme) => ({

}));

const ShopMypage = ({}) => {
  const classes = useStyles();
  const [shopProductList, setShopProductList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(loading){
      fetch(yujinserver+"/shop/productListBySeller", {
        credentials: 'include'
      })
      .then(
        (res) => res.json(),
        (error) => console.error(error)
      )
      .then((json) => {
        const parsedPreviews = json.imgs.reduce((result = {}, item) => {
            const id = item.productId
            if(!result[id]) result[id] = []
            result[id] = [...result[id], {color: item.color, img: item.img}]
            return result
        }, {})
        const options = json.productInfos.reduce((result = {}, item) => {
            if(item.cnt !== 0){
                const id = item.productId
                if(!result[id]) result[id] = []
                result[id] = [...result[id], {optionId: item.id, color: item.color, size: item.size, cnt: item.cnt}]
            }
            return result
        }, {})
        setShopProductList(
          <ShopProductList products={json.products.filter((product) => product.deletedAt === null)} options={options} previews={parsedPreviews} reload={() => setLoading(true)} />
        )
        setLoading(false)
      })
    }
  }, [loading])

  return(
    <Container maxWidth="md">
      <ShopSubheader />
      <Box>
        {shopProductList}
      </Box>
    </Container>
  )
}

ShopMypage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopMypage)