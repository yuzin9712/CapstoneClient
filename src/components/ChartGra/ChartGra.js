import React from 'react';


import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush,
    AreaChart, Area,
  } from 'recharts';
  
  const data = [
    {
      name: '1월', num: 3600
    },
    {
      name: '2월', num: 3000
    },
    {
      name: '3월', num: 2000
    },
    {
      name: '4월', num: 2780
    },
    {
      name: '5월', num: 1890
    },
    {
      name: '6월', num: 2390
    },
    {
      name: '7월', num: 3490
    },
    {
      name: '8월', num: 3490
    },
  ];

export default class ChartGra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
   
  }

}
// static jsfiddleUrl = 'https://jsfiddle.net/alidingling/nskpgcrz/';
    render() { 
   
      
        return (
             <LineChart
          width={500}
          height={300}
          data={this.props.grapData}
          syncId="anyId"
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="num" stroke="#8884d8" fill="#8884d8" />
        </LineChart>
        );
    }
}


