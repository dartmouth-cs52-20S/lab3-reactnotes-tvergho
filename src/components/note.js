import React, { Component } from 'react';
import Draggable from 'react-draggable';
import marked from 'marked';
import TextareaAutosize from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsAlt, faTrashAlt, faEdit, faCheck,
} from '@fortawesome/free-solid-svg-icons';

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      editText: '',
    };
  }

  edit = (event) => {
    this.setState({ editText: event.target.value });
  }

  save = () => {
    const originalState = this.state.isEditing;
    if (originalState) {
      this.props.onNoteChange(this.state.editText);
    } else {
      this.setState({ editText: this.props.note.text });
    }
    this.setState({ isEditing: !originalState });
  }

  renderNoteBody() {
    if (this.state.isEditing) {
      return (<TextareaAutosize className="text-edit" value={this.state.editText} onChange={this.edit} />);
    } else {
      return (
        // eslint-disable-next-line react/no-danger
        <div className="note-text" dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />
      );
    }
  }

  renderSaveIcon() {
    if (this.state.isEditing) {
      return (
        <FontAwesomeIcon icon={faCheck} size="lg" className="title-icon" />
      );
    } else {
      return (
        <FontAwesomeIcon icon={faEdit} size="lg" className="title-icon" />
      );
    }
  }

  render() {
    return (
      <Draggable
        defaultPosition={{ x: this.props.note.x, y: this.props.note.y }}
        onDrag={this.props.onDrag}
        handle=".drag-icon"
      >

        <div className="note" style={{ zIndex: this.props.note.zIndex }}>
          <div className="title-header">
            <div className="title">{this.props.note.title}</div>
            <button type="button" onClick={this.props.onDelete}>
              <FontAwesomeIcon icon={faTrashAlt} size="lg" className="title-icon" />
            </button>
            <button type="button" onClick={this.save}>
              { this.renderSaveIcon() }
            </button>
            <div id="note-divider" />
          </div>
          <FontAwesomeIcon icon={faArrowsAlt} className="drag-icon" size="lg" />

          { this.renderNoteBody() }

        </div>
      </Draggable>
    );
  }
}

export default Note;
