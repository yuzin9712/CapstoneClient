import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Button, Divider,
} from '@material-ui/core'
import ProductList from './Product/ProductList';
import {sangminserver} from '../restfulapi';
import ProductRecentPage from './Product/ProductRecentPage';

const useStyles = makeStyles((theme) => ({
  title: {
      flexGrow: 1
  }
}));

const Home = () => {
  const classes = useStyles();

  return(
    <ProductRecentPage />
  )
}

export default Home
