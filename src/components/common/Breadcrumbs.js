// 각 페이지의 맨위에서 "메인 / 어디 / 어디"이렇게 보여주는 내비게이션
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

}));

const Breadcrumbs = (steps) => {
    const classes = useStyles();

    return(
        <div></div>
    )
}

Breadcrumbs.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs)
