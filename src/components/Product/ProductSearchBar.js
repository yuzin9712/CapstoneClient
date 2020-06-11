// subheader에서 사용할 검색바
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, TextField, InputAdornment,
} from '@material-ui/core'
import { Search } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { push } from 'connected-react-router';

const useStyles = makeStyles((theme) => ({

}));

const ProductSearchBar = ({push}) => {
    const classes = useStyles();
    const { register, control, handleSubmit } = useForm();

    const searchProduct = (data) => {
        push('/productList/search?keyword='+data.keyword)
    }

    return(
        <form 
            onSubmit={handleSubmit(searchProduct)}
        >
            <TextField
                inputRef={register({required: true})}
                name="keyword"
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <Search />
                    </InputAdornment>
                ),
                }}
            />
        </form>
    )
}

ProductSearchBar.propTypes = {
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
    push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductSearchBar)
