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

const sampleDesign = () => {
    const temp = [];
    while(temp.length<10) temp.push({
        "id": 4,
        "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/1588077824737testimg1.jpg",
        "createdAt": "2020-04-30T16:06:25.000Z",
        "updatedAt": "2020-04-30T16:06:25.000Z",
        "deletedAt": null,
        "userId": 2,
        "closetId": 14,
        "likecount": 0,
        "hashtags": [
            {
                "title": "메롱"
            },
            {
                "title": "다른디자인게시물"
            },
            {
                "title": "같은사진"
            },
            {
                "title": "테스트"
            }
        ],
        "closet": {
            "id": 14,
            "products": [
                {
                    "id": 5,
                    "seller": "언더아머",
                    "pname": "스파이크트레이닝긴팔",
                    "price": 40000,
                    "description": "상의3",
                    "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/top3-1586279327511.jpg",
                    "createdAt": "2020-04-08T00:00:00.000Z",
                    "updatedAt": null,
                    "deletedAt": null,
                    "categoryId": 1
                },
                {
                    "id": 1,
                    "seller": "룩앤핏",
                    "pname": "스트라이프긴팔티",
                    "price": 12000,
                    "description": "테스트1",
                    "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/top1-1585993258043.jpg",
                    "createdAt": "2020-04-04T00:00:00.000Z",
                    "updatedAt": null,
                    "deletedAt": null,
                    "categoryId": 1
                }
            ]
        },
        "user": {
            "id": 2,
            "name": "김유진"
        }
    },
    {
        "id": 3,
        "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/1588077824737testimg1.jpg",
        "createdAt": "2020-04-28T16:33:07.000Z",
        "updatedAt": "2020-04-28T16:33:07.000Z",
        "deletedAt": null,
        "userId": 2,
        "closetId": 14,
        "likecount": 0,
        "hashtags": [
            {
                "title": "테스트"
            },
            {
                "title": "수정하기"
            }
        ],
        "closet": {
            "id": 14,
            "products": [
                {
                    "id": 5,
                    "seller": "언더아머",
                    "pname": "스파이크트레이닝긴팔",
                    "price": 40000,
                    "description": "상의3",
                    "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/top3-1586279327511.jpg",
                    "createdAt": "2020-04-08T00:00:00.000Z",
                    "updatedAt": null,
                    "deletedAt": null,
                    "categoryId": 1
                },
                {
                    "id": 1,
                    "seller": "룩앤핏",
                    "pname": "스트라이프긴팔티",
                    "price": 12000,
                    "description": "테스트1",
                    "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/top1-1585993258043.jpg",
                    "createdAt": "2020-04-04T00:00:00.000Z",
                    "updatedAt": null,
                    "deletedAt": null,
                    "categoryId": 1
                }
            ]
        },
        "user": {
            "id": 2,
            "name": "김유진"
        }
    });
    return temp;
}

const DesignList = ({designs}) => {
    if(!designs.length) return(<div>불러온 디자인이 없어요</div>)
    // console.log(designs)

    const designCards = designs.map((data) => {
        return <DesignCard design={data}/>
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
