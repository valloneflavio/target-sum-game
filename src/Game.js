import React, { Component } from 'react';
import _ from 'lodash';
import Number from  './components/Number'
import './App.css';


const bgColors = {
    playing: '#ccc',
    won: 'green',
    lost: 'red',
};

class Game extends Component {

    state = {
        gameStatus: 'new', // new, playing, won, lost
        remainingSeconds: this.props.initialSeconds,
        selectedIds: [],
    };  

    componentDidMount() {
        if (this.props.autoPlay) {
            this.startGame();
        }
    }    
    
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }    

    //Function to generate random number into interval
    randomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;   
    
    //Check if the number button is clickable
    isNumberAvailable = (numberIndex) => this.state.selectedIds.indexOf(numberIndex) === -1;    

    //Function to start a game
    startGame = () => {
        this.setState({ gameStatus: 'playing' }, () => {
          this.intervalId = setInterval(() => {
            this.setState((prevState) => {
              const newRemainingSeconds = prevState.remainingSeconds - 1;
              if (newRemainingSeconds === 0) {
                clearInterval(this.intervalId);
                return { gameStatus: 'lost', remainingSeconds: 0 };
              }
              return { remainingSeconds: newRemainingSeconds };
            });
          }, 1000);
        });
      };

    selectNumber = (numberIndex) => {
        if (this.state.gameStatus !== 'playing') {
            return;
        }
        this.setState(
            (prevState) => ({
            selectedIds: [...prevState.selectedIds, numberIndex],
            gameStatus: this.calcGameStatus([
                ...prevState.selectedIds,
                numberIndex,
            ]),
            }),
            () => {
            if (this.state.gameStatus !== 'playing') {
                clearInterval(this.intervalId);
            }
            }
        );
    };

    calcGameStatus = (selectedIds) => {
        const sumSelected = selectedIds.reduce(
            (acc, curr) => acc + this.challengeNumbers[curr],
            0
        );
        if (sumSelected < this.target) {
            return 'playing';
        }
        return sumSelected === this.target ? 'won' : 'lost';
    };      

    challengeNumbers = Array
        .from({ length: this.props.challengeSize })
        .map(() => this.randomNumberBetween(...this.props.challengeRange));

    target = _.sampleSize(
      this.challengeNumbers,
      this.props.challengeSize - 2
    ).reduce((acc, curr) => acc + curr, 0);    
  
  render() {

    const { gameStatus, remainingSeconds } = this.state;    
        
    return (
      <div className="game">
        <div className="target" style={{ backgroundColor: bgColors[this.state.gameStatus] }}>
            {this.state.gameStatus === 'new' ? '?' : this.target}
        </div>
        <div className="challenge-numbers">
            { this.challengeNumbers.map((value, index) =>
                <Number
                    key={index}
                    id={index}
                    value={gameStatus === 'new' ? '?' : value}
                    clickable={this.isNumberAvailable(index)}
                    onClick={this.selectNumber}             
                />
                
            )}
        </div>
        <div className="footer">
            <div className="sub-footer">
            {
                this.state.gameStatus === 'new' ? (<button onClick={this.startGame} className="game-button">Start</button>) : ( this.state.remainingSeconds > 0 && !['won', 'lost'].includes(this.state.gameStatus)) ? (
                    <div className="timer-value">{this.state.remainingSeconds}</div>
                ) : ( ['won', 'lost'].includes(this.state.gameStatus) && (<button onClick={this.props.onPlayAgain} className="game-button">Play Again</button>) )
            }
            </div>    
            <div className="sub-footer">
                <p style={{ backgroundColor: bgColors[this.state.gameStatus] }}>
                {  (this.state.gameStatus) === 'won' ? 'YOU WIN!!!' : (this.state.gameStatus) === 'lost' ? 'You Lose... try again!!' : ''}
                </p>            
            </div>
        </div>        
      </div>
    );
  }
}

export default Game;
