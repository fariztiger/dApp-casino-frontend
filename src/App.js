import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  duration = 2000; // 2 seconds
  updateLoop = 50;
  minSpeed = 10;
  stopPosition = [ 'apple', 'watermelon', 'strawberry' ];
  tapeMapping = { 'apple': -120, 'watermelon': 0, 'strawberry': -261 };
  speeds = [ 0, 0, 0 ];
  nextTapeStop = 0;
  intervalId = null;

  constructor(props) {
    super(props);
    this.state = { margins: [ { 'marginTop': '-374px' }, { 'marginTop': '-254px' }, { 'marginTop': '-128px' } ] };

    this.updateTape = this.updateTape.bind(this);
    this.bet = this.bet.bind(this);
  }

  getTimestamp() {
    return (new Date()).getTime();
  }

  updateTape() {
    let currentMargins = this.state.margins;
    let slowDownProcessed = false;
    let tapeSpeeds = this.speeds;

    for ( let tapeId of [ 0, 1, 2 ] ) {
      if ( this.speeds[ tapeId ] === 0 ) {
        continue;
      }

      let marginNumber = currentMargins[ tapeId ][ 'marginTop' ].replace('px', '') * 1;
      let tapeSpeed = tapeSpeeds[ tapeId ];

      let newMargin;

      // in slow motion finding the right one
      if ( this.nextTapeStop <= this.getTimestamp() && !slowDownProcessed && tapeSpeed === this.minSpeed ) {
        // check if we're around the image
        let tapeWinningCharacter = this.stopPosition[ tapeId ];
        let tapeTarget = this.tapeMapping[ tapeWinningCharacter ];

        // tape runs
        let threshold = 32;
        if ( Math.abs(marginNumber - tapeTarget) <= threshold ) {
          newMargin = tapeTarget;
          tapeSpeed = 0;
        }
        else {
          newMargin = marginNumber + tapeSpeed;
        }

        slowDownProcessed = true;
      }
      else {
        // should slow down?
        if ( this.nextTapeStop <= this.getTimestamp() && !slowDownProcessed ) {
          if ( tapeSpeed > this.minSpeed ) {
            tapeSpeed -= 1;
          }
          slowDownProcessed = true;
        }

        newMargin = marginNumber + tapeSpeed;
      }

      tapeSpeeds[ tapeId ] = tapeSpeed;

      if ( newMargin > 0 ) {
        newMargin = -374;
      }

      currentMargins[ tapeId ] = { 'marginTop': `${newMargin}px` };
    }

    this.setState({ margins: currentMargins });
    let isFinished = tapeSpeeds.filter(v => v > 0).length === 0;
    if ( isFinished ) {
      clearInterval(this.intervalId);
    }
  }

  bet() {
    this.speeds = [ 100, 100, 100 ];
    this.nextTapeStop = this.getTimestamp() + this.duration;
    this.intervalId = setInterval(() => this.updateTape(), this.updateLoop);
  }

  render() {
    return (
      <div className="main">
        <div className="machine">
          <div className="slot">
            <img src='/tape-1.png' key={1} style={this.state.margins[ 0 ]}/>
          </div>
          <div className="slot">
            <img src='/tape-1.png' key={1} style={this.state.margins[ 1 ]}/>
          </div>
          <div className="slot">
            <img src='/tape-1.png' key={1} style={this.state.margins[ 2 ]}/>
          </div>
        </div>
        <div className="controls">
          <button onClick={this.bet}>Put my money and bet</button>
        </div>
      </div>
    );
  }
}

export default App;
