import React from 'react';


import {
  PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default class ChartPie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data03: [
        { name: "상의", value: 10},
        { name: "하의", value: 5},
        { name: "신발", value: 8},
        { name: "악세", value: 3}
       
      ]
  }
  //this.a=this.a.bind(this);
 
}


componentWillMount(){
  
}


  render() { 
      return (
        <ResponsiveContainer height={300}>
        <PieChart>
        <Pie dataKey="value" isAnimationActive={false} data={this.props.pieData}
         startAngle={90} endAngle={-90}
         cx={0} cy={150} outerRadius={80} fill="#8884d8" label >
           {
             this.props.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
           }
        </Pie>
          
          <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        );
    }
}

