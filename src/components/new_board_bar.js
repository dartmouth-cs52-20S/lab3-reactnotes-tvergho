import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class NewBoardBar extends Component {
  constructor(props) {
    super(props);

    this.state = { newBoardName: '' };
  }

  onInputChange = (event) => {
    this.setState({ newBoardName: event.target.value });
  }

  // Code taken from: https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
  randomString = (length, chars) => {
    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  newBoard = () => {
    if (!this.state.newBoardName) {
      return (`/${this.randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}`);
    } else {
      return (`/${this.state.newBoardName}`);
    }
  }

  render() {
    return (
      // Bootstrap formatting taken from: https://getbootstrap.com/docs/4.0/components/navbar/
      <form className="form-inline new-board-bar d-inline w-25" onSubmit={(e) => { e.preventDefault(); }}>
        <div className="input-group">
          <input
            className="form-control mr-2"
            id="input-text"
            type="text"
            placeholder="new board name"
            aria-label="new board name"
            value={this.state.newBoardName}
            onChange={this.onInputChange}
          />
          <Link to={() => this.newBoard()}><button className="btn btn-primary my-xs-2" type="button" onClick={this.props.onBoardRefresh}>Generate Board</button></Link>
        </div>
      </form>
    );
  }
}

export default withRouter(NewBoardBar);
