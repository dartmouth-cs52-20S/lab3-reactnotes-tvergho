import React, { Component } from 'react';

class AddNoteBar extends Component {
  constructor(props) {
    super(props);

    this.state = { title: '' };
  }

  onInputChange = (event) => {
    this.setState({ title: event.target.value });
  }

  render() {
    return (
    // Bootstrap formatting taken from: https://getbootstrap.com/docs/4.0/components/navbar/
      <form className="form-inline add-note-bar d-inline w-25" onSubmit={(e) => this.props.onClick(e, this.state.title)}>
        <div className="input-group">
          <input className="form-control mr-2" id="input-text" type="text" placeholder="new note title" aria-label="new note title" value={this.state.title} onChange={this.onInputChange} />
          <button className="btn btn-success my-xs-2" type="button" onClick={(e) => this.props.onClick(e, this.state.title)}>Add Note</button>
        </div>
      </form>
    );
  }
}

export default AddNoteBar;
