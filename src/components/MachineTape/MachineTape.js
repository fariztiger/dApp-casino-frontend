import { Component } from 'react';
import React from 'react';

class MachineTape extends Component {
  render() {
    return (
      <div className="slot">
        <img src='/tape-1.png' style={this.props.margin} alt='tape'/>
      </div>
    )
  }
}

export default MachineTape;