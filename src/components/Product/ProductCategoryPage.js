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

const ProductCategoryPage = ({pathname, search, match}) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true)
    const [initialProducts, setInitialProducts] = useState([])
    const [products, setProducts] = useState([])
    const [previews, setPreviews] = useState([])
    const [ productListComponent, setProductListComponent ] = useState(null)
    const [ category, setCategory ] = useState("")
    const [option, setOption] = useState({
      filter: "A",
      sort: "none",
    })
    const [optionButtons, setOptionButtons] = useState({
      recent: (<Button onClick={() => setOption({...option, recent: "desc"})}>최신<ArrowDropUp /></Button>),
      sales: (<Button onClick={() => setOption({...option, sales: "desc"})}>인기<ArrowDropUp /></Button>),
      price: (<Button onClick={() => setOption({...option, price: "desc"})}>가격<ArrowDropUp /></Button>),
    })

    useEffect(() => {
        setLoading(true)
    }, [pathname])

    useEffect(() => {
      if(loading){
        setProductListComponent(null)
        const id = match.params.id;
        const categoryId = pathname.substring(pathname.lastIndexOf('/') + 1)
        setCategory(categoryLookup[categoryId])
        fetch(sangminserver+"/product/categoryBest/"+id, {
            credentials: 'include',
        })
        .then(
            (res) => res.json(),
            (error) => console.error(error)
        )
        .then((json) => {
          const length = json.products.length
          const products = json.products.reduce((result, product, index) => {
            if(Boolean(product.deletedAt)
            || result.some((resultItem) => resultItem.id === product.id)){
              return result
            }
            else return [...result, {
              ...product,
              sales: length - index,
            }]
          }, [])
          setPreviews(json.imgs)
          setInitialProducts(products)
          setProducts(products)
          setOption({
            ...option,
            sort: 'recent-desc'
          })
        })
        setLoading(false)
      }
    }, [loading])

    useEffect(() => {
      if(previews.length > 0){
        setProductListComponent(
          <ProductList products={products} previews={previews} />
        )
      }
    }, [products])

    useEffect(() => {
      if(option.filter === "A") setProducts(initialProducts)
      else if(option.filter === "U") {
        const newArray = initialProducts.filter((product) => product.gender === "U")
        setProducts(newArray)
      }
      else if(option.filter === "M") {
        const newArray = initialProducts.filter((product) => product.gender !== "W")
        setProducts(newArray)
      }
      else if(option.filter === "W") {
        const newArray = initialProducts.filter((product) => product.gender !== "M")
        setProducts(newArray)
      }
    }, [option.filter])
    useEffect(() => {
      switch(option.sort){
        case("recent-desc"): {
          setOptionButtons({
            recent: (<Button color="secondary" onClick={() => setOption({...option, sort: "recent-asc"})}>최신<ArrowDropUp /></Button>),
            sales: (<Button onClick={() => setOption({...option, sort: "sales-desc"})}>인기<ArrowDropUp /></Button>),
            price: (<Button onClick={() => setOption({...option, sort: "price-desc"})}>가격<ArrowDropUp /></Button>),
          })
          const newArray = products.sort((a,b) => ((Boolean(b.updateAt)?Date.parse(b.updatedAt):Date.parse(b.createdAt)) - (Boolean(a.updateAt)?Date.parse(a.updatedAt):Date.parse(a.createdAt)))).slice()
          setProducts(newArray)
          break
        }
        case("recent-asc"): {
          setOptionButtons({
            recent: (<Button color="secondary" onClick={() => setOption({...option, sort: "recent-desc"})}>최신<ArrowDropDown /></Button>),
            sales: (<Button onClick={() => setOption({...option, sort: "sales-desc"})}>인기<ArrowDropUp /></Button>),
            price: (<Button onClick={() => setOption({...option, sort: "price-desc"})}>가격<ArrowDropUp /></Button>),
          })
          const newArray = products.sort((a,b) => ((Boolean(a.updateAt)?Date.parse(a.updatedAt):Date.parse(a.createdAt)) - (Boolean(b.updateAt)?Date.parse(b.updatedAt):Date.parse(b.createdAt)))).slice()
          setProducts(newArray)
          break
        }
        case("sales-desc"): {
          setOptionButtons({
            recent: (<Button onClick={() => setOption({...option, sort: "recent-desc"})}>최신<ArrowDropUp /></Button>),
            sales: (<Button color="secondary" onClick={() => setOption({...option, sort: "sales-asc"})}>인기<ArrowDropUp /></Button>),
            price: (<Button onClick={() => setOption({...option, sort: "price-desc"})}>가격<ArrowDropUp /></Button>),
          })
          const newArray = products.sort((a,b) => b.sales - a.sales).slice()
          setProducts(newArray)
          break
        }
        case("sales-asc"): {
          setOptionButtons({
            recent: (<Button onClick={() => setOption({...option, sort: "recent-desc"})}>최신<ArrowDropUp /></Button>),
            sales: (<Button color="secondary" onClick={() => setOption({...option, sort: "sales-desc"})}>인기<ArrowDropDown /></Button>),
            price: (<Button onClick={() => setOption({...option, sort: "price-desc"})}>가격<ArrowDropUp /></Button>),
          })
          const newArray = products.sort((a,b) => a.sales - b.sales).slice()
          setProducts(newArray)
          break
        }
        case("price-desc"): {
          setOptionButtons({
            recent: (<Button onClick={() => setOption({...option, sort: "recent-desc"})}>최신<ArrowDropUp /></Button>),
            sales: (<Button onClick={() => setOption({...option, sort: "sales-desc"})}>인기<ArrowDropUp /></Button>),
            price: (<Button color="secondary" onClick={() => setOption({...option, sort: "price-asc"})}>가격<ArrowDropUp /></Button>),
          })
          const newArray = products.sort((a,b) => b.price - a.price).slice()
          setProducts(newArray)
          break
        }
        case("price-asc"): {
          setOptionButtons({
            recent: (<Button onClick={() => setOption({...option, sort: "recent-desc"})}>최신<ArrowDropUp /></Button>),
            sales: (<Button onClick={() => setOption({...option, sort: "sales-desc"})}>인기<ArrowDropUp /></Button>),
            price: (<Button color="secondary" onClick={() => setOption({...option, sort: "price-desc"})}>가격<ArrowDropDown /></Button>),
          })
          const newArray = products.sort((a,b) => a.price - b.price).slice()
          setProducts(newArray)
          break
        }
        default: {}
      }
    }, [option.sort])

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

  return(
    <Container maxWidth="md">
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6">{category}</Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <ButtonGroup>
            {genderLookup.map((gender) => (
              <Button onClick={() => setOption({...option, filter: gender.code})}>{gender.description}</Button>
            ))}
          </ButtonGroup>
          <Box display="flex" justifyContent="flex-end">
            {optionButtons.recent}
            {optionButtons.sales}
            {optionButtons.price}
          </Box>
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
