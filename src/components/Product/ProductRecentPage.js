// "/productList?category=*"에서 상품 상세정보 확인하는 페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import queryString from 'query-string'

import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
  Grid,
  Typography,
  Divider,
  Button,
  Box,
  ButtonGroup,
} from '@material-ui/core'
import {sangminserver} from '../../restfulapi';

import ProductList from './ProductList'
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({

}));

const ProductCategoryPage = ({pathname, search}) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true)
    const [products, setProducts] = useState([])
    const [previews, setPreviews] = useState([])
    const [ productListComponent, setProductListComponent ] = useState(null)

    useEffect(() => {
        while(loading){
          fetch(sangminserver+"/product", {
              credentials: 'include',
          })
          .then(
              (res) => res.json(),
              (error) => console.error(error)
          )
          .then((json) => {
            const recentProducts = (json.productRows.sort((a,b) => Math.max(new Date(b.createdAt), new Date(b.updatedAt)) - Math.max(new Date(a.createdAt), new Date(a.updatedAt)))).slice(0,8)
            setPreviews(json.imgArr)
            setProducts(recentProducts)
          })
          setLoading(false)
          break
        }
    }, [loading])

    useEffect(() => {
        setProductListComponent(
            <ProductList products={products} previews={previews} />
        )
    }, [products])    

  return(
    <Container maxWidth="md">
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box flexGrow={1} component={Typography} variant="h4" gutterBottom>최신상품</Box>
      </Box>
      <Divider />
      {productListComponent}
    </Container>
  )
    
}

ProductCategoryPage.propTypes = {
    //pathname: PropTypes.string,
    search: PropTypes.string,
    //hash: PropTypes.string,
}


const mapStateToProps = state => ({
    pathname: state.router.location.pathname,
    search: state.router.location.search,
    //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategoryPage)
