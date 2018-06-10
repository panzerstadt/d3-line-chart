/*
https://codeburst.io/create-an-interactive-line-graph-with-hovering-to-render-a-dual-line-highlight-using-vx-and-d3-308c00e57042
*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import LineChart from "./js/linechart.js";


//render()


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <LineChart/>
      </div>
    );
  }
}

export default App;
