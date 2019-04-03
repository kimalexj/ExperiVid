import React, { Component } from 'react';
import Camera from './Components/Camera'

class App extends Component {

  /*
  constructor() {
    super()
    // Include state when necessary
  }
  */

  render() {
    return (
      <div class="container-fluid">
        <h1 class="text-center"> Bootstrap Rocks </h1>
        <Camera />
      </div>
    );
  }
}

export default App;
