// "/cart"에서 확인하는 장바구니페이지
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
  Grid,
  Typography,
  Box,
} from '@material-ui/core'
import ClosetCard from './ClosetCard';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({

}));

const sampleCloset = () => {
    const temp = [];
    while(temp.length<100) temp.push({
        "id": 14,
        "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/1588077824737testimg1.jpg",
        "createdAt": "2020-04-28T12:43:48.000Z",
        "updatedAt": "2020-04-28T12:43:48.000Z",
        "deletedAt": null,
        "userId": 2,
        "products": [
            {
                "id": 1,
                "seller": "룩앤핏",
                "pname": "스트라이프긴팔티",
                "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/top1-1585993258043.jpg",
                "price": 12000,
                "description": "테스트1"
            },
            {
                "id": 5,
                "seller": "언더아머",
                "pname": "스파이크트레이닝긴팔",
                "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/top3-1586279327511.jpg",
                "price": 40000,
                "description": "상의3"
            }
        ]
    });
    return temp;
}

const ClosetList = ({closets, reload}) => {
    const [ closetCards, setClosetCards ] = useState(null)

    useEffect(() => {
        if(closets){
            if(closets.length) setClosetCards(closets.map((closet) => {
                return <ClosetCard closet={closet} reload={() => reload()} />
            }))
        }
        else setClosetCards(<Typography gutterBottom>없어요</Typography>)
    }, [closets])
    

    return(
        <Grid component={Container} maxWidth="md" container>
                {closetCards}
        </Grid>
    )
}

ClosetList.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ClosetList)
