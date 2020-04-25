import React, { Component } from 'react';
import Draggable from 'react-draggable';
import marked from 'marked';
import TextareaAutosize from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsAlt, faTrashAlt, faEdit, faCheck,
} from '@fortawesome/free-solid-svg-icons';
// import { ResizableBox } from 'react-resizable';

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      editText: '',
      editTitle: '',
    };
  }

  editTitle = (event) => {
    this.setState({ editTitle: event.target.value });
  }

  editText = (event) => {
    this.setState({ editText: event.target.value });
  }

  save = () => {
    const originalState = this.state.isEditing;
    if (originalState) {
      this.props.onNoteChange(this.state.editTitle, this.state.editText);
    } else {
      this.setState({
        editTitle: this.props.note.title,
        editText: this.props.note.text,
      });
    }
    this.setState({ isEditing: !originalState });
  }

  renderNoteTitle() {
    if (this.state.isEditing) {
      return (<TextareaAutosize className="text-edit" id="title-edit" value={this.state.editTitle} onChange={this.editTitle} />);
    } else {
      return (
        <div className="title">{this.props.note.title}</div>
      );
    }
  }

  renderNoteBody() {
    if (this.state.isEditing) {
      return (<TextareaAutosize className="text-edit" value={this.state.editText} onChange={this.editText} />);
    } else {
      return (
        // eslint-disable-next-line react/no-danger
        <div className="note-text" dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />
      );
    }
  }

  renderSaveButton() {
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
        onStart={this.props.onStartDrag}
        onDrag={this.props.onDrag}
        handle=".drag-icon"
        position={{ x: this.props.note.x, y: this.props.note.y }}
      >

        { /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */ }
        <div className="note" style={{ zIndex: this.props.note.zIndex }} onClick={(e) => this.props.onClick(e)}>
          <div className="title-header">
            { this.renderNoteTitle() }
            <div className="edit-icons">
              <button type="button" onClick={(e) => this.props.onDelete(e)}>
                <FontAwesomeIcon icon={faTrashAlt} size="lg" className="title-icon" />
              </button>
              <button type="button" onClick={this.save}>
                { this.renderSaveButton() }
              </button>
            </div>
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
