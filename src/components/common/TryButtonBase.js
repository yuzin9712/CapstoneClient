// 입어보기 버튼 누를때 팝업되는 리스트
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Menu,
  MenuItem
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

}));

const TryButtonBase = ({ images }) => {
    const classes = useStyles();
    const items = images.map((image) => {
        const onClick = () => {
            console.log(image.src);
        }
        return <MenuItem onClick={onClick}>{image.color}</MenuItem>
    })
    return(
        <Menu
        >
            {items}
        </Menu>
    )
}

TryButtonBase.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TryButtonBase)
