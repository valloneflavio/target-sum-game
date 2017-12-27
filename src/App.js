import React, { Component } from 'react';
import Game from  './Game'
import './App.css';

class App extends Component {

  state = {
    gameId: 1,
  };
  
  resetGame = () =>
    this.setState((prevState) => ({
      gameId: prevState.gameId + 1,
   }));  
  
  render() {  
    return (
      <Game 
        key={this.state.gameId}
        autoPlay={this.state.gameId > 1}
        challengeSize={6}
        challengeRange={[2, 9]}
        initialSeconds={10}
        onPlayAgain={this.resetGame} />
    );
  }
}

export default App;
