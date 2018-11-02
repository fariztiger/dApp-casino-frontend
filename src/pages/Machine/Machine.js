import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';

import { loadSlotMachineContract } from "../../actions/slotMachineActions";
import MachineTape from '../../components/MachineTape/MachineTape';
import './Machine.scss';

class Machine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      margins: [ {'marginTop': '-374px'}, {'marginTop': '-254px'}, {'marginTop': '-128px'} ],
      isContractInitialized: false
    };
  }

  componentWillMount = () => {
    this.initContract()
  };

  // chould have more checks with old browsers
  initContract = () => {
    const contractAddress = '0xa9fa39e0e78e8e16699569a890b9c91e2d74a7ce';
    if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);

      this.props.loadSlotMachineContract().then(contract => {
        this.machineContract = new this.web3.eth.Contract(contract.abi, contractAddress);

        this.setState({isContractInitialized: true});
      });
    }
  };

  getTimestamp = () => {
    return (new Date()).getTime();
  };

  isWaitingFinished = () => {
    return this.nextTapeStop <= this.getTimestamp()
  };

  updateTapeProperties = (tapeSpeeds, margins, tapeId) => {
    const minTapeSpeed = 10;
    const tapeMapping = [ -120, 0, -261 ];
    const tapeInitialMargin = -374;

    if (tapeSpeeds[ tapeId ] === 0) {
      return;
    }

    let marginNumber = margins[ tapeId ][ 'marginTop' ].replace('px', '') * 1;
    let tapeSpeed = tapeSpeeds[ tapeId ];

    let newMargin;

    if (tapeSpeed === minTapeSpeed) {
      // check if we're around the image
      let tapeWinningCharacter = this.finalTapePositions[ tapeId ];
      let tapeTarget = tapeMapping[ tapeWinningCharacter ];

      const threshold = 32;
      if (Math.abs(marginNumber - tapeTarget) <= threshold) {
        newMargin = tapeTarget;
        tapeSpeed = 0;
      }
      else {
        newMargin = marginNumber + tapeSpeed;
      }
    }
    else {
      // should slow down?
      const shouldTapeSlowDown = tapeId === 0 || tapeSpeeds[ tapeId - 1 ] === 0;

      if (this.isWaitingFinished() && shouldTapeSlowDown) {
        tapeSpeed -= 1;
      }

      newMargin = marginNumber + tapeSpeed;
    }

    newMargin = newMargin > 0 ? tapeInitialMargin : newMargin;

    tapeSpeeds[ tapeId ] = tapeSpeed;
    margins[ tapeId ] = {'marginTop': `${newMargin}px`};
  };

  updateTapes = () => {
    let currentMargins = this.state.margins;
    let tapeSpeeds = this.speeds;

    [ 0, 1, 2 ].forEach(tapeId => this.updateTapeProperties(tapeSpeeds, currentMargins, tapeId));

    this.setState({margins: currentMargins});

    let isFinished = tapeSpeeds.filter(v => v > 0).length === 0;

    if (isFinished) {
      clearInterval(this.intervalId);
      this.setStatusMessage(`Your reward is ${this.state.reward} ETH`);
    }
  };

  bet = () => {
    const maxGas = 150000;
    const price = 0.5;

    this.web3.eth.getCoinbase((err, account) => {
      this.machineContract.methods.play().send({
        from: account,
        gas: maxGas,
        value: window.web3.toWei(price, 'ether')
      })
        .on('receipt', receipt => {
          // add check for transaction status etc
          let result = receipt.events.GameResult.returnValues;
          this.finalTapePositions = [ result.tape1, result.tape2, result.tape3 ];

          this.startSpinning();

          this.setState({'reward': window.web3.fromWei(result.reward, 'ether')});
        });
    });
  };

  startSpinning = () => {
    const tapeUpdateInterval = 50;
    const spinDuration = 2000;
    const initialSpeed = [ 100, 100, 100 ];

    this.setStatusMessage(null);

    this.speeds = initialSpeed;
    this.nextTapeStop = this.getTimestamp() + spinDuration;

    this.intervalId = setInterval(() => this.updateTapes(), tapeUpdateInterval);
  };

  setStatusMessage = (msg) => {
    this.setState({'statusMsg': msg});
  };

  render = () => {
    const slots = [ 0, 1, 2 ].map(v => <MachineTape margin={this.state.margins[ v ]} key={v}/>);

    return (
      <div className="slot-machine">
        <div className="screen">
          {slots}
        </div>

        <div className="status">
          {this.state.statusMsg && this.state.statusMsg}
        </div>

        <div className="controls">
          <button onClick={this.bet} className="test" disabled={!this.state.isContractInitialized}>Put my money and
            bet
          </button>
        </div>

        <div className="init-error">
          {!this.state.isContractInitialized && 'Couldn\'t load contract/web3 provider'}
        </div>
      </div>
    );
  }
}

export default connect(null, {loadSlotMachineContract})(Machine);
