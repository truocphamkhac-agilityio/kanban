import AltContainer from 'alt-container';
import React, {Component, PropTypes} from 'react';

import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';

class Lane extends Component {
  constructor(props) {
    super(props);

    this.handleAddNote = this.handleAddNote.bind(this);
    this.handleEditNote = this.handleEditNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.activateLaneEdit = this.activateLaneEdit.bind(this);
    this.handleEditLaneName = this.handleEditLaneName.bind(this);
    this.handleDeleteLane = this.handleDeleteLane.bind(this);
    this.activateNoteEdit = this.activateNoteEdit.bind(this);
  }

  render() {
    const className = this.props.className;
    const lane = this.props.lane;

    return (
      <div className={className}>
        <div className="lane-header" onClick={this.activateLaneEdit}>
          <div className="lane-add-note">
            <button onClick={this.handleAddNote}>+</button>
          </div>
          <Editable
            className="lane-name"
            editing={lane.editing}
            value={lane.name}
            onEdit={this.handleEditLaneName}
          />
          <div className="lane-delete">
            <button onClick={this.handleDeleteLane}>x</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: lane.notes
          }}
        >
          <Notes
            onValueClick={this.activateNoteEdit}
            onEdit={this.handleEditNote}
            onDelete={this.handleDeleteNote}
          />
        </AltContainer>
      </div>
    );
  }

  handleAddNote(e) {
    e.stopPropagation();

    const laneId = this.props.lane.id;

    NoteActions.create({task: 'New Task', editing: false});

    LaneActions.attachToLane({laneId});
  }

  handleEditNote(id, task) {
    let noteUpdate;
    const laneId = this.props.lane.id;

    if (!task.trim()) {
      noteUpdate = NoteActions.update({id, editing: false});
    } else {
      noteUpdate = NoteActions.update({id, task, editing: false});
    }

    // update to lane
    LaneActions.update(
      {
        id: laneId,
        name: this.props.lane.name,
        editing: this.props.lane.editing,
        noteUpdate: noteUpdate
      }
    );
  }

  handleDeleteNote(id, e) {
    e.stopPropagation();

    LaneActions.detachFromLane({
      laneId: this.props.lane.id,
      noteId: id
    });

    NoteActions.delete(id);
  }

  activateLaneEdit() {
    const laneId = this.props.lane.id;

    LaneActions.update({id: laneId, editing: true});
  }

  activateNoteEdit(noteId) {
    const laneId = this.props.lane.id;
    const noteUpdate = NoteActions.update({id: noteId, editing: true});

    // update to lane
    LaneActions.update(
      {
        id: laneId,
        name: this.props.lane.name,
        editing: this.props.lane.editing,
        noteUpdate: noteUpdate
      }
    );
  }

  handleEditLaneName(laneName) {
    const laneId = this.props.lane.id;

    if (!laneName.trim()) {
      LaneActions.update({id: laneId, editing: false});
      return;
    }

    LaneActions.update({id: laneId, name: laneName, editing: false});
  }

  handleDeleteLane(e) {
    e.stopPropagation();
    const laneId = this.props.lane.id;

    LaneActions.delete(laneId);
  }
}

Lane.propTypes = {
  lane: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    notes: PropTypes.array,
    editing: PropTypes.boolean
  }).isRequired
};

Lane.defaultProps = {
  name: '',
  editing: false,
  notes: []
};

/**
 * Expose
 */
export default Lane;
