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
} from '@material-ui/core'
import {sangminserver} from '../../restfulapi';

import ProductList from './ProductList'

const useStyles = makeStyles((theme) => ({

}));

const ProductSearchPage = ({pathname, search}) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true)
    const [ productList, setProductList ] = useState(null)
    const [ keyword, setKeyword ] = useState("")

    useEffect(() => {
        setKeyword(queryString.parse(search).keyword)
        fetch(sangminserver+"/product/search/", 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                'Cache': 'no-cache'
            },
            body: JSON.stringify({
                keyword: queryString.parse(search).keyword,
            }),
            credentials: 'include',
        })
        .then(
            (res) => res.json(),
            (error) => { console.error(error) }
        )
        .then((json) => {
            // TODO: preview 누락!!
            if(json.productRows.length){
                setProductList(<ProductList products={json.productRows.filter((product) => product.deletedAt === null)} />)
            }
            else setProductList(<div>결과없어요~</div>)
            
            setLoading(false)
        })
    }, [search])

    return(
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>'{keyword}' 검색 결과</Typography>
            <Divider />
            {productList}
        </Container>
    )
    
}

ProductSearchPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductSearchPage)
