// "/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
  Grid,
} from '@material-ui/core'
import DesignCard from './DesignCard';

const useStyles = makeStyles((theme) => ({

}));

const DesignList = ({designs, reload}) => {
    if(!designs.length) return(<div>불러온 디자인이 없어요</div>)

    const designCards = designs.map((data) => {
      return <DesignCard key={data.id} design={data} reload={reload} />
    })

    return(
      <Container maxWidth="md">
        <Grid container>
          {designCards}
        </Grid>
      </Container>
    )
}

DesignList.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DesignList)
