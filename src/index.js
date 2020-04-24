import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { Map } from 'immutable';
import Note from './components/note';
import AddNoteBar from './components/add_note_bar';
import * as db from './services/datastore';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextZ: 0,
      // eslint-disable-next-line new-cap
      notes: Map(),
    };
  }

  componentDidMount() {
    db.fetchNotes((notes) => {
      // eslint-disable-next-line new-cap
      this.setState({ notes: Map(notes) });
    });
  }

  delete = (id) => {
    db.deleteNote(id);
  }

  noteChange = (id, newTitle, newText) => {
    const newNote = this.state.notes.get(id);
    newNote.title = newTitle;
    newNote.text = newText;
    db.updateNote(id, newNote);
  }

  handleDrag = (e, ui, id) => {
    const newNote = this.state.notes.get(id);
    newNote.x = ui.x;
    newNote.y = ui.y;
    db.updateNote(id, newNote);
  };

  onAddNote = (e, title) => {
    e.preventDefault();
    const z = this.state.nextZ;
    const note = {
      title,
      text: '',
      x: 200,
      y: 200,
      zIndex: z,
    };
    const update = (key) => {
      this.setState((prevState) => ({
        nextZ: z + 1,
        notes: prevState.notes.set(key, note),
      }));
    };
    db.addNote(note, (key) => update(key));
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
            onNoteChange={(title, text) => this.noteChange(id, title, text)}
          />
        )) }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
