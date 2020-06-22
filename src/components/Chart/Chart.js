import React from 'react';
import ChartBar from '../ChartBar';
import ChartGra from '../ChartGra';
import ChartPie from '../ChartPie'
import { yujinserver } from '../../restfulapi';
import { Box, Typography, Paper, Grid, Divider } from '@material-ui/core';

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieData: [],
      barData: {
        category1: [],
        category2: [],
        category3: [],
        category4: []
      },
      grapData: [
        {
          name: '1월', num: 0
        },
        {
          name: '2월', num: 0
        },
        {
          name: '3월', num: 0
        },
        {
          name: '4월', num: 0
        },
        {
          name: '5월', num: 0
        },
        {
          name: '6월', num: 0
        },
        {
          name: '7월', num: 0
        },
        {
          name: '8월', num: 0
        },
        {
          name: '9월', num: 0
        },
        {
          name: '10월', num: 0
        },
        {
          name: '11월', num: 0
        },
        {
          name: '12월', num: 0
        },
      ]
    }
}

componentDidMount(){
  callApi1()
  .then(res => {
    const convertedData = this.convertResDataToChartPie(res);
    this.setState({
      pieData: convertedData
    });
  })
  .catch(error => console.error(error));

 callApi2()
  .then(res => {
    const convertedData = this.convertResDataToChartBar(res);
    this.setState({
      barData: convertedData
    });
  })
  .catch(error => console.error(error));

 callApi3()
  .then(res => {
    const convertedData = this.convertResDataToChartGrap(res);
    this.setState({
      grapData: convertedData
    });
  })
  .catch(error => console.error(error));
  }

  render() {
    return (
      <Box>
        <Typography gutterBottom variant="h5">요약</Typography>
        <Divider />
        <Box display="flex" p={1} flexDirection="row">
          <Box p={1} m={3} component={Paper}>
            <Typography gutterBottom>월 수익 그래프</Typography>
            <ChartGra grapData={this.state.grapData}/>
          </Box>
          <Box flexGrow={1} p={1} m={3} component={Paper}>
            <Typography gutterBottom>카테고리별 판매총량</Typography>
            <ChartPie pieData={this.state.pieData} />
          </Box>
        </Box>
        <Typography gutterBottom variant="h5">품목별 판매량</Typography>
        <Divider />
        <Box p={1}>
          <Grid container direction="row">
            <Box width={1/2} p={1}>
              <Box p={1} component={Paper}>
                <Typography gutterBottom>👔상의</Typography>
                <ChartBar barData={this.state.barData.category1}/>
              </Box>
            </Box>
            <Box width={1/2} p={1}>
              <Box p={1} component={Paper}>
              <Typography gutterBottom>👖하의</Typography>
              <ChartBar barData={this.state.barData.category2}/>
              </Box>
            </Box>
            <Box width={1/2} p={1}>
              <Box p={1} component={Paper}>
              <Typography gutterBottom>🎀패션잡화</Typography>
              <ChartBar barData={this.state.barData.category3}/>
              </Box>
            </Box>
            <Box width={1/2} p={1}>
              <Box p={1} component={Paper}>
              <Typography gutterBottom>🥾신발</Typography>
              <ChartBar barData={this.state.barData.category4}/>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Box>
            //  통계관련
            //  카테고리별 판매량
            //  <ChartPie pieData={this.state.pieData} />
            //  상의품목별판매량
            //  <ChartBar barData={this.state.barData.category1}/>
            //  하의품목별판매량
            //  <ChartBar barData={this.state.barData.category2}/>
            //  신발품목별판매량
            //  <ChartBar barData={this.state.barData.category3}/>
            //  악세서리품목별판매량
            //  <ChartBar barData={this.state.barData.category4}/>
            //  총 수익 그래프
            // </div>
    );
  }

    convertResDataToChartPie(datas) {
      const tempData = [];
      for (const data of datas) {
        let name = '';
        switch (data.product.categoryId) {
          case 1:
            name = '상의';
            break;
          case 2:
            name = '하의';
            break;
          case 3:
            name = '패션잡화';
            break;
          case 4:
            name = '신발';
            break;
        }

        tempData.push({
          name,
          value: data.sales - 0
        });
      }

      return tempData;
    }

    convertResDataToChartBar(datas) {
      const tempDatas= {};
      Object.keys(datas).map((key) => {
        const tempData = [];
        for (const data of datas[key]) {
          // let name = '';
          // if(data.product.pname.length > 4) {
          //   for ( let i =0; i < 4; i++) {
          //     name += data.product.pname[i];
          //   }
          //   name += '...';
          // }
          tempData.push({
            name: data.product.pname, 
            num: data.sales - 0
          });
        }
        tempDatas[key] = tempData;
      });

      return tempDatas;
    }

    convertResDataToChartGrap(datas) {
      const tempData = [
          {
            name: '1월', num: 0
          },
          {
            name: '2월', num: 0
          },
          {
            name: '3월', num: 0
          },
          {
            name: '4월', num: 0
          },
          {
            name: '5월', num: 0
          },
          {
            name: '6월', num: 0
          },
          {
            name: '7월', num: 0
          },
          {
            name: '8월', num: 0
          },
          {
            name: '9월', num: 0
          },
          {
            name: '10월', num: 0
          },
          {
            name: '11월', num: 0
          },
          {
            name: '12월', num: 0
          },
        ];
        datas.map((data, index) => {
          const tempYM = data.ym.split('-');
          tempData[tempYM[1] - 1]['num'] = data.sales;
        });

      return tempData;
    }
}


const callApi1 = async () => {
  const response = await fetch(yujinserver+'/category', {
    credentials: 'include'
  })
  const body = await response.json();
  return body;
}
  const callApi2 = async () => {
    const response = await fetch(yujinserver+'/category/detail', {
      credentials: 'include'
    })
    const body = await response.json();
    return body;
  }
  

  const callApi3 = async () => {
    const response = await fetch(yujinserver+'/month', {
      credentials: 'include'
    })
    const body = await response.json();
    return body;
  }
  
  
  

