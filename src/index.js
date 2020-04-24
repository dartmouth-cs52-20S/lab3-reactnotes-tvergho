import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { Map } from 'immutable';
import Note from './components/note';
import AddNoteBar from './components/add_note_bar';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextId: 2,
      // eslint-disable-next-line new-cap
      notes: Map({
        0: {
          title: 'first note',
          text: 'Hello world',
          x: 20,
          y: 80,
          zIndex: 0,
        },
        1: {
          title: 'second note',
          text: 'Hello world',
          x: 120,
          y: 160,
          zIndex: 1,
        },
      }),
    };
  }

  handleDrag = (e, ui, id) => {
    this.setState((prevState) => ({
      notes: prevState.notes.update(id, (n) => { return { ...n, x: ui.x, y: ui.y }; }),
    }));
  };

  delete = (id) => {
    this.setState((prevState) => ({
      notes: prevState.notes.delete(id),
    }));
  }

  noteChange = (id, newText) => {
    this.setState((prevState) => ({
      notes: prevState.notes.update(id, (n) => { return { ...n, text: newText }; }),
    }));
  }

  onAddNote = (e, title) => {
    e.preventDefault();
    const i = this.state.nextId;
    this.setState((prevState) => ({
      nextId: i + 1,
      notes: prevState.notes.set(`${i}`, {
        title,
        text: '',
        x: 200,
        y: 200,
        zIndex: i,
      }),
    }));
  }

  render() {
    return (
      <div>
        <AddNoteBar onClick={(e, title) => this.onAddNote(e, title)} />
        { this.state.notes.entrySeq().map(([id, note]) => (
          <Note key={id}
            note={note}
            onDrag={(e, ui) => this.handleDrag(e, ui, id)}
            onDelete={() => this.delete(id)}
            onNoteChange={(text) => this.noteChange(id, text)}
          />
        )) }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
