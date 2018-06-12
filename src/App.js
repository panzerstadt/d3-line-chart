/*
https://codeburst.io/create-an-interactive-line-graph-with-hovering-to-render-a-dual-line-highlight-using-vx-and-d3-308c00e57042
*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import LineChart from "./js/linechart";

import { timeFormat } from 'd3-time-format';

import json_data from "./data/dummy2";
const affinities_data = json_data.results.hourly.content.affinities;
const formatDate = timeFormat("%b %d, '%y");

const r = affinities_data.chart_recent;
const h = affinities_data.chart_historical;

// output required
/*

[
  [{label:thing, date:date, score:score}, ...]
  [{label:thing, date:date, score:score}, ...]
  ...
]


*/

// let pos = [];

// data.forEach((v,i)=> {

//   v.result.forEach((w,j)=> {

//     w.label = v.label;
//     pos.push(w);

//   })

// })

// // label == date
// const list_affinities_recent = r[0].slice(1, r[0].length);  // affinities labels
// const list_affinities_historical = h[0].slice(1, h[0].length);

// let data_formatted = []
// const list_of_lines = []
// r.forEach(element => {
//   let affinities = r.slice(1, r.length); // cuts away the date label, keeps data

//   let list_label_data = affinities.map(((v,i) => {
//     list_of_lines.push()
//   }));

//   // each row
//   recent_affinities.forEach(element => {
//     data_1.push({
//       label: formatDate(element[0]),
//       score: element[1]
//     })
//   });
  
// });

const list_recent_affinities_label = r[0].slice(1, r[0].length)  // all affinities labels
const table_data = r.slice(1, r.length);
const r_affinities_all = list_recent_affinities_label.map((v, i) => {
  // make the dataset by each column
  let data_i = table_data.map((w,j) => {
    let date = w[0];
    let score = w[i+1];  // this is wrong
    let label = v;
    return {
      label: label,
      date: date,
      score: score
    }
  });
  return data_i; // append to the full dataset
});


console.log(r_affinities_all[0]);



//console.log(recent_affinities);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <LineChart
            label={'hey dog'}
            data={r_affinities_all}
            width={800}
            height={480}
            margin={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            />  
        </div>    
      </div>

    );
  }
}

export default App;
