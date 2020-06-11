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
  ButtonGroup,
  Box,
} from '@material-ui/core'
import {sangminserver} from '../../restfulapi';

import ProductList from './ProductList'
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({

}));

const categoryLookup = [
    "", "상의", "하의", "패션잡화", "신발"
]

const ProductCategoryPage = ({pathname, search}) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true)
    const [initialProducts, setInitialProducts] = useState([])
    const [products, setProducts] = useState([])
    const [previews, setPreviews] = useState([])
    const [ productListComponent, setProductListComponent ] = useState(null)
    const [ category, setCategory ] = useState("")

    useEffect(() => {
        setLoading(true)
    }, [pathname])

    useEffect(() => {
        while(loading){
            const categoryId = pathname.substring(pathname.lastIndexOf('/') + 1)
            console.log(categoryId)
            setCategory(categoryLookup[categoryId])
            fetch(sangminserver+"/product/category/"+categoryId, {
                credentials: 'include',
            })
            .then(
                (res) => res.json(),
                (err) => console.error(err)
            )
            .then((json) => {
              const recentProducts = json.productRows.sort((a,b) => Math.max(new Date(b.createdAt), new Date(b.updatedAt)) - Math.max(new Date(a.createdAt), new Date(a.updatedAt))).slice()
                setPreviews(json.imgArr)
                setInitialProducts(recentProducts)
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

    const genderLookup = [
      {
        code: "A",
        description: "전체보기"
      },
      {
        code: "M",
        description: "남성용"
      },
      {
        code: "W",
        description: "여성용"
      },
      {
        code: "U",
        description: "공용"
      },
    ]
    const filterGender = (gender) => {
      if(gender === "A") setProducts(initialProducts)
      else if(gender === "U") {
        const newArray = initialProducts.filter((product) => product.gender === "U")
        setProducts(newArray)
      }
      else if(gender === "M") {
        const newArray = initialProducts.filter((product) => product.gender !== "W")
        setProducts(newArray)
      }
      else if(gender === "W") {
        const newArray = initialProducts.filter((product) => product.gender !== "M")
        setProducts(newArray)
      }
    }
    const sortUpdatedAscending = () => {
        const newArray = products.sort((a,b) => Math.max(new Date(a.createdAt), new Date(a.updatedAt)) - Math.max(new Date(b.createdAt), new Date(b.updatedAt))).slice()
        setProducts(newArray)
    }
    const sortUpdatedDescending = () => {
      setProducts(initialProducts)
    }
    const sortPriceAscending = () => {
        const newArray = products.sort((a,b) => a.price - b.price).slice()
        setProducts(newArray)
    }
    const sortPriceDescending = () => {
        const newArray = products.sort((a,b) => b.price - a.price).slice()
        setProducts(newArray)
    }

  return(
    <Container maxWidth="md">
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box flexGrow={1} component={Typography} variant="h4" gutterBottom>{category}</Box>
        <Box>
          <ButtonGroup>
            {genderLookup.map((gender) => (
              <Button onClick={() => filterGender(gender.code)}>{gender.description}</Button>
            ))}
          </ButtonGroup>
          <Button onClick={() => sortUpdatedAscending()}>최신<ArrowDropDown /></Button>
          <Button onClick={() => sortUpdatedDescending()}>최신<ArrowDropUp /></Button>
          <Button onClick={() => sortPriceAscending()}>가격<ArrowDropDown /></Button>
          <Button onClick={() => sortPriceDescending()}>가격<ArrowDropUp /></Button>
        </Box>
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
