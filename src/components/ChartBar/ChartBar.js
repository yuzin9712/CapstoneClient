import React from 'react';


import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: '후드티 A', num: 4000
  },
  {
    name: '후드티 B', num: 3000
  },
  {
    name: '후드티 C', num: 2000
  },
  {
    name: '후드티 D', num: 2780
  },
  {
    name: '후드티 E', num: 1890
  },
  {
    name: '후드티 F', num: 2390
  },
  {
    name: '후드티 G', num: 3490
  },
];

export default class ChartBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
   
  }

}
// static jsfiddleUrl = 'https://jsfiddle.net/alidingling/90v76x08/';
    render() { 
   
      
        return (
          <ResponsiveContainer width="100%" height={300}>
             <BarChart
        data={this.props.barData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
      
        <Bar dataKey="num" stackId="a" fill="#82ca9d" />
      </BarChart>
      </ResponsiveContainer>
        );
    }
}


