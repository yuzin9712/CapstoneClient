/page/post 커뮤니티메인
[
    {
        "id": 10,
        "title": "제목수정하기",
        "content": "내용 수저ㅇ하기~!~!",
        "createdAt": "2020-04-30T17:43:00.000Z",
        "updatedAt": "2020-05-06T03:58:44.000Z",
        "deletedAt": null,
        "userId": 2,
        "likecount": 2,
        "commentcount": 3,
        "user": {
            "id": 2,
            "name": "김유진"
        },
        "Pimgs": [
            {
                "id": 11,
                "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/1586965701899testimg1.jpg"
            },
            {
                "id": 12,
                "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/1588077824737testimg1.jpg"
            },
            {
                "id": 13,
                "img": "test"
            }
        ]
    }
]

/post/:postid 글상세
{
    "id": 17,
    "title": "크크크크",
    "content": "크크크흐흐",
    "createdAt": "2020-05-14T11:51:35.000Z",
    "updatedAt": "2020-05-14T11:51:35.000Z",
    "deletedAt": null,
    "userId": 10,
    "likecount": 0,
    "commentcount": 0,
    "user": {
        "id": 10,
        "name": "유저1"
    },
    "Pimgs": [
        {
            "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/original/158945709383220200509222448_1.jpg",
            "closetId": null,
            "closet": null
        },
        {
            "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/original/158945709385020200502031555_1.jpg",
            "closetId": null,
            "closet": null
        },
        {
            "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/original/158945709390020200501180039_1.jpg",
            "closetId": null,
            "closet": null
        },
        {
            "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/%EC%98%B7%EC%9E%A57.JPG",
            "closetId": 22,
            "closet": {
                "id": 22,
                "products": [
                    {
                        "id": 36,
                        "seller": "프롬비기닝",
                        "pname": "링클 스트랩 숄더 백",
                        "price": 19000,
                        "description": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/DESC.png",
                        "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/%EB%8C%80%ED%91%9C.jpg",
                        "createdAt": "2020-05-13T18:45:28.000Z",
                        "updatedAt": "2020-05-13T18:45:34.000Z",
                        "deletedAt": null,
                        "categoryId": null
                    },
                    {
                        "id": 37,
                        "seller": "프롬비기닝",
                        "pname": "무드 빈티지 핀턱 슬랙스",
                        "price": 30000,
                        "description": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/DESC-4.png",
                        "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/%EB%8C%80%ED%91%9C-4.jpg",
                        "createdAt": "2020-05-13T19:01:01.000Z",
                        "updatedAt": null,
                        "deletedAt": null,
                        "categoryId": null
                    },
                    {
                        "id": 38,
                        "seller": "프롬비기닝",
                        "pname": "달리 와이드프릴블라우스",
                        "price": 50000,
                        "description": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/DESC-3.png",
                        "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/%EB%8C%80%ED%91%9C-3.jpg",
                        "createdAt": "2020-05-13T19:00:53.000Z",
                        "updatedAt": null,
                        "deletedAt": null,
                        "categoryId": null
                    }
                ]
            }
        },
        {
            "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/%EC%98%B7%EC%9E%A55.JPG",
            "closetId": 20,
            "closet": {
                "id": 20,
                "products": [
                    {
                        "id": 4,
                        "seller": "댄디룩",
                        "pname": "챠콜와이드슬랙스",
                        "price": 18000,
                        "description": "댄디한바지구만유",
                        "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/bottom1-1586096638561.jpg",
                        "createdAt": "2020-04-05T00:00:00.000Z",
                        "updatedAt": null,
                        "deletedAt": null,
                        "categoryId": 2
                    },
                    {
                        "id": 32,
                        "seller": null,
                        "pname": "정품3",
                        "price": 3333,
                        "description": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/1589307348226%EC%83%81%EC%84%B8%EC%83%81%EC%84%B81.png",
                        "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/1589307348206%EC%8D%B8%EB%84%A4%EC%9D%BC1.PNG",
                        "createdAt": "2020-05-13T00:00:00.000Z",
                        "updatedAt": null,
                        "deletedAt": null,
                        "categoryId": 1
                    }
                ]
            }
        }
    ],
    "postComments": [
        {
            "id": 1,
            "content": "2번이 달았구낭 댓글수정테스트",
            "user": {
                "id": 2,
                "name": "김유진"
            },
            "Cimgs": []
        },
        {
            "id": 4,
            "content": "2번이 10번 게시물에 댓글을 작성했습니다!!!",
            "user": {
                "id": 2,
                "name": "김유진"
            },
            "Cimgs": [
                {
                    "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/1586965701899testimg1.jpg",
                    "closetId": 8,
                    "closet": {
                        "id": 8,
                        "products": [
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
                            },
                            {
                                "id": 3,
                                "seller": "필라",
                                "pname": "분홍트레이닝팬츠",
                                "price": 25000,
                                "description": "부농부농한 바지",
                                "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/bottom2-1586096576135.jpg",
                                "createdAt": "2020-04-05T00:00:00.000Z",
                                "updatedAt": null,
                                "deletedAt": null,
                                "categoryId": 2
                            },
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
                                "id": 6,
                                "seller": "휠라",
                                "pname": "야광트레이닝바지",
                                "price": 33000,
                                "description": "테스트용",
                                "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/product/bottom3-1586680092012.jpg",
                                "createdAt": "2020-04-12T00:00:00.000Z",
                                "updatedAt": null,
                                "deletedAt": null,
                                "categoryId": 2
                            }
                        ]
                    }
                },
                {
                    "img": "https://swcap02.s3.ap-northeast-2.amazonaws.com/closet/1588077824737testimg1.jpg",
                    "closetId": 14,
                    "closet": {
                        "id": 14,
                        "products": [
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
                            },
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
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": 5,
            "content": "12번이 댓글을 다는데 사진을 아무것도 안올렸음!!",
            "user": {
                "id": 12,
                "name": "유저3"
            },
            "Cimgs": []
        }
    ]
}

글쓰기: 주소 "/post/" POST
이미지 img //맞춰봐야됨
제목 title
내용 content
클로젯 closet [어레이로 closet id보냄] //맞춰봐야됨

댓글쓰기: 주소 "/comment/post/:postid" POST
이미지 img //3개
내용 content
클로젯 closet [어레이로 closet id보냄] //맞춰봐야됨


