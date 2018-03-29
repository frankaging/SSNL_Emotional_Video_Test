import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {
    return (
      // <div className="App">
      //   {/* <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h1 className="App-title">Welcome to React</h1>
      //   </header>
      //   <p className="App-intro">
      //     To get started, edit <code>src/App.js</code> and save to reload.
      //   </p> */}

        
      // </div>
      
      <div className="intropage">
        <img src={logo} width="250" height="160"/>
        <h1>Stanford Social Neuroscience Lab</h1>
        <p>
          In this study, we are interested in how people make judgments about other people's emotions. 
        This task will take approximately 30 minutes.
        <br></br><br></br>
        Please make sure your <b>sound</b> is on.
        <br></br><br></br>
        Do not do this HIT on a mobile device or tablet.
          
          </p>
      </div>
      
    );
  }
}

export default App;
