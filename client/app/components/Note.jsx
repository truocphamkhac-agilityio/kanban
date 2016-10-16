import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

/* eslint-disable no-unused-vars */
import {expect} from 'chai';

const noteSource = {
  beginDrag(props) {
    console.log('begin dragging note', props);
    return {};
  }
};

/**
 * define the collect function
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Note extends Component {
  render() {
    const connectDragSource = this.props.connectDragSource;
    const isDragging = this.props.isDragging;

    return connectDragSource(
      <li
        className={this.props.className}
        id={this.props.id}
        key={this.props.id}
        style={{
          opacity: isDragging ? 0.5 : 1
        }}
      >
        {this.props.children}
      </li>
    );
  }
}

Note.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

/**
 * Expose
 */
export default Note;

module.exports = DragSource(ItemTypes.NOTE, noteSource, collect)(Note);
