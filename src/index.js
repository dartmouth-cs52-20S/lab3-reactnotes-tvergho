import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { Map, List } from 'immutable';
import Note from './components/note';
import AddNoteBar from './components/add_note_bar';
import * as db from './services/datastore';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextZ: 0,
      hasBeenInitialized: false,
      // eslint-disable-next-line new-cap
      notes: Map(),
      // eslint-disable-next-line new-cap
      undoHistory: List(),
    };
  }

  componentDidMount() {
    db.fetchNotes((notes) => {
      // console.log(notes);
      this.setState((prevState) => ({
        // eslint-disable-next-line new-cap
        notes: Map(notes),
      }));

      if (!this.state.hasBeenInitialized) {
        this.setState((prevState) => ({
          // eslint-disable-next-line new-cap
          undoHistory: prevState.undoHistory.push(Map(notes)),
          hasBeenInitialized: true,
        }), () => {
          this.updateZ();
        });
      }
    });
  }

  addToUndo = () => {
    this.setState((prevState) => ({
      undoHistory: prevState.undoHistory.push(prevState.notes),
    }));
  }

  undo = () => {
    if (this.state.undoHistory.size >= 2) {
      db.updateAllNotes(this.state.undoHistory.get(this.state.undoHistory.size - 2));

      this.setState((prevState) => ({
        undoHistory: prevState.undoHistory.pop(),
      }));
    }
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

  bringToFront = (id) => {
    this.updateZ();
    db.updateZ(id, this.state.nextZ);
  }

  delete = (e, id) => {
    e.stopPropagation();
    db.deleteNote(id);
    this.addToUndo();
  }

  noteChange = (id, newTitle, newText) => {
    console.log(this.state.notes.get(id));
    const newNote = this.state.notes.get(id);
    newNote.title = newTitle;
    newNote.text = newText;
    db.updateNote(id, newNote);
    this.addToUndo();
  }

  handleDrag = (e, ui, id) => {
    const newNote = this.state.notes.get(id);
    newNote.x = ui.x;
    newNote.y = ui.y;
    newNote.zIndex = this.state.nextZ;
    db.updateNote(id, newNote);
    this.addToUndo();
  }

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
    this.addToUndo();
  }

  resize = (e, direction, ref, delta, pos, id) => {
    const newNote = this.state.notes.get(id);
    newNote.width += delta.width;
    newNote.height += delta.height;
    db.updateNote(id, newNote);
    this.addToUndo();
  }

  render() {
    return (
      <div>
        <AddNoteBar onClick={(e, title) => this.onAddNote(e, title)} undo={() => this.undo()} />
        { this.state.notes.entrySeq().map(([id, note]) => (
          <Note key={id}
            note={note}
            onDrag={(e, ui) => this.handleDrag(e, ui, id)}
            onStartDrag={() => this.bringToFront(id)}
            onDelete={(e) => this.delete(e, id)}
            onNoteChange={(title, text) => this.noteChange(id, title, text)}
            onClick={() => this.bringToFront(id)}
            onResizeStart={() => this.bringToFront(id)}
            onResize={(e, direction, ref, delta, pos) => this.resize(e, direction, ref, delta, pos, id)}
          />
        )) }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
