import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Container } from '@material-ui/core';
import ProductCard from './ProductCard';

import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    cardGrid: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
}));

const ProductList = ({products, previews}) => {
    const classes = useStyles();
    const parsedPreviews = previews !== undefined? previews.reduce((result = {}, item) => {
        const id = item.productId
        if(!result[id]) result[id] = []
        result[id] = [...result[id], {color: item.color, img: item.img}]
        return result
    }, {})
    : []

    const items = products.map((product) => {
        
        return (
            <ProductCard product={product} preview={parsedPreviews[product.id]} key={product.id}/>
        )
    });
    // console.log(data);

    return (
        <Grid container spacing={1}>
            {items}
        </Grid>
    )
  }
  
  ProductList.propTypes = {
    fetchurl: PropTypes.object,
  }
    
  export default ProductList