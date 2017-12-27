import React, { Component } from 'react';
//import './Number.css';

class Number extends Component {

    handleClick = () => {
        if (this.props.clickable) {
            this.props.onClick(this.props.id);
        }
    };

  render() {
    return (
        <div 
            className="number"
            style={{ opacity: this.props.clickable ? 1 : 0.3 }}
            onClick={this.handleClick}            
        >
            {this.props.value}
        </div>
    );
  }
}

export default Number;
