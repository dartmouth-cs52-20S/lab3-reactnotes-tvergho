import React, { useEffect } from 'react';
// import { useParams } from 'react-router';
import { withRouter } from 'react-router-dom';
import Note from './note';
import * as db from '../services/datastore';

const NoteGenerator = (props) => {
  const boardId = props.match.params.id;

  useEffect(() => {
    props.onBoardRefresh();
    if (props.match.params !== undefined) {
      db.fetchNotes(props.match.params.id, (notes) => props.onDataChange(notes));
    }
  }, [boardId]);

  return (
    props.notes.entrySeq().map(([id, note]) => {
      return (
        <Note key={id}
          note={note}
          onDrag={(e, ui) => props.handleDrag(e, ui, id, boardId)}
          onStartDrag={() => props.bringToFront(id, boardId)}
          onDelete={(e) => props.delete(e, id, boardId)}
          onNoteChange={(title, text) => props.noteChange(id, title, text, boardId)}
          onClick={() => props.bringToFront(id, boardId)}
          onResizeStart={() => props.bringToFront(id, boardId)}
          onResize={(e, direction, ref, delta, pos) => props.resize(e, direction, ref, delta, pos, id, boardId)}
        />
      );
    })
  );
};

export default withRouter(NoteGenerator);
