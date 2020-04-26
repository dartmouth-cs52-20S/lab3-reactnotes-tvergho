import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { Map, List } from 'immutable';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import NoteGenerator from './components/note_generator';
import AddNoteBar from './components/add_note_bar';
import NewBoardBar from './components/new_board_bar';
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

  refresh = () => {
    this.setState(() => ({
      nextZ: 0,
      hasBeenInitialized: false,
      // eslint-disable-next-line new-cap
      notes: Map(),
      // eslint-disable-next-line new-cap
      undoHistory: List(),
    }));
  }

  updateNotes = (notes) => {
    this.setState((prevState) => ({
      // eslint-disable-next-line new-cap
      notes: Map(notes),
    }), () => {
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

  undo = (boardId) => {
    if (this.state.undoHistory.size >= 2) {
      db.updateAllNotes(this.state.undoHistory.get(this.state.undoHistory.size - 2), boardId);

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

  bringToFront = (id, boardId) => {
    this.updateZ();
    db.updateZ(id, this.state.nextZ, boardId);
  }

  delete = (e, id, boardId) => {
    e.stopPropagation();
    db.deleteNote(id, boardId);
    this.addToUndo();
  }

  noteChange = (id, newTitle, newText, boardId) => {
    const newNote = this.state.notes.get(id);
    newNote.title = newTitle;
    newNote.text = newText;
    db.updateNote(id, newNote, boardId, () => this.addToUndo());
  }

  handleDrag = (e, ui, id, boardId) => {
    const newNote = this.state.notes.get(id);
    newNote.x = ui.x;
    newNote.y = ui.y;
    newNote.zIndex = this.state.nextZ;
    db.updateNote(id, newNote, boardId, () => this.addToUndo());
  }

  onAddNote = (e, title, boardId) => {
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
    db.addNote(note, boardId, (id) => {
      this.addToUndo();
      this.bringToFront(id, boardId);
    });
  }

  resize = (e, direction, ref, delta, pos, id, boardId) => {
    const newNote = this.state.notes.get(id);
    newNote.width += delta.width;
    newNote.height += delta.height;
    db.updateNote(id, newNote, boardId, () => this.addToUndo());
  }

  render() {
    return (
      <Router>
        <NewBoardBar onBoardRefresh={() => this.refresh()} />

        {/* eslint-disable-next-line react/jsx-props-no-spreading */ }
        <Route exact path="/" render={(props) => (<AddNoteBar onClick={(e, title, boardId) => this.onAddNote(e, title, boardId)} undo={(boardId) => this.undo(boardId)} {...props} />)} />
        <Route exact
          path="/"
          render={(props) => (
            <NoteGenerator
              notes={this.state.notes}
              handleDrag={(e, ui, id, boardId) => this.handleDrag(e, ui, id, boardId)}
              bringToFront={(id, boardId) => this.bringToFront(id, boardId)}
              delete={(e, id, boardId) => this.delete(e, id, boardId)}
              noteChange={(id, title, text, boardId) => this.noteChange(id, title, text, boardId)}
              resize={(e, direction, ref, delta, pos, id, boardId) => this.resize(e, direction, ref, delta, pos, id, boardId)}
              onDataChange={(notes) => this.updateNotes(notes)}
              onBoardRefresh={() => this.refresh()}
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...props}
            />
          )}
        />

        {/* eslint-disable-next-line react/jsx-props-no-spreading */ }
        <Route path="/:id" render={(props) => (<AddNoteBar onClick={(e, title, boardId) => this.onAddNote(e, title, boardId)} undo={(boardId) => this.undo(boardId)} {...props} />)} />
        <Route path="/:id"
          render={(props) => (
            <NoteGenerator
              notes={this.state.notes}
              handleDrag={(e, ui, id, boardId) => this.handleDrag(e, ui, id, boardId)}
              bringToFront={(id, boardId) => this.bringToFront(id, boardId)}
              delete={(e, id, boardId) => this.delete(e, id, boardId)}
              noteChange={(id, title, text, boardId) => this.noteChange(id, title, text, boardId)}
              resize={(e, direction, ref, delta, pos, id, boardId) => this.resize(e, direction, ref, delta, pos, id, boardId)}
              onDataChange={(notes) => this.updateNotes(notes)}
              onBoardRefresh={() => this.refresh()}
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...props}
            />
          )}
        />
      </Router>
    );
  }
}

ReactDOM.render(
  <App />, document.getElementById('main'),
);
