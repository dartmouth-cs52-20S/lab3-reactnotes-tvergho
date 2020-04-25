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
      this.setState((prevState) => ({
        // eslint-disable-next-line new-cap
        notes: Map(notes),
      }));
    });
  }

  updateZ = () => {
    let z = this.state.nextZ;
    this.state.notes.valueSeq().toArray().forEach((note) => {
      if (note.zIndex >= z) {
        z = note.zIndex + 1;
      }
    });

    this.setState(() => ({
      nextZ: z,
    }));
  }

  bringToFront = (e, id) => {
    e.stopPropagation();
    this.updateZ();
    const newNote = this.state.notes.get(id);
    newNote.zIndex = this.state.nextZ;
    db.updateNote(id, newNote);
  }

  delete = (e, id) => {
    e.stopPropagation();
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
    newNote.zIndex = this.state.nextZ;
    db.updateNote(id, newNote);
  };

  onAddNote = (e, title) => {
    e.preventDefault();
    this.updateZ();
    const z = this.state.nextZ;
    const note = {
      title,
      text: '',
      x: 200,
      y: 200,
      zIndex: z,
      width: 300,
      height: 100,
    };
    db.addNote(note);
  }

  resize = (e, direction, ref, delta, pos, id) => {
    const newNote = this.state.notes.get(id);
    newNote.width += delta.width;
    newNote.height += delta.height;
    db.updateNote(id, newNote);
  }

  heightChange = (size, id) => {
    console.log('height change');
    const newNote = this.state.notes.get(id);
    newNote.height = size.height + 70;
    console.log(size.height);
    db.updateNote(id, newNote);
  }

  render() {
    return (
      <div>
        <AddNoteBar onClick={(e, title) => this.onAddNote(e, title)} />
        { this.state.notes.entrySeq().map(([id, note]) => (
          <Note key={id}
            note={note}
            onDrag={(e, ui) => this.handleDrag(e, ui, id)}
            onStartDrag={() => this.updateZ()}
            onDelete={(e) => this.delete(e, id)}
            onNoteChange={(title, text) => this.noteChange(id, title, text)}
            onClick={(e) => this.bringToFront(e, id)}
            onResize={(e, direction, ref, delta, pos) => this.resize(e, direction, ref, delta, pos, id)}
            onHeightChange={(size) => this.heightChange(size, id)}
          />
        )) }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
