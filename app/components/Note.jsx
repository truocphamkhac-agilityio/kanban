import React from 'react';

export default class Note extends React.Component {
  constructor(props) {
    super(props);

    // Track `editing` state
    this.state = {
      editing: false
    };
  }

  render() {
    // Render the component differently based on state
    if (this.state.editing) {
      return this.renderEdit();
    }

    return this.renderNote();
  }

  renderEdit = () => {
    return (
      <input type="text"
        ref={(e) => e ? e.selectionStart = this.props.task.length : null}
        autoFocus={true}
        defaultValue={this.props.task}
        onBlur={this.finishEdit}
        onKeyPress={this.checkEnter}></input>
    );
  };

  renderNote = () => {
    // IF the user clicks a normal note. trigger editing logic
    return <div onClick={this.edit}>{this.props.task}</div>;
  };

  edit = () => {
    // Enter edit note
    this.setState({
      editing: true
    });
  };

  finishEdit = (e) => {
    const value = e.target.value;

    if (this.props.onEdit) {
      this.props.onEdit(value);

      // Exit edit mode
      this.setState({
        editing: false
      });
    }
  };

  checkEnter = (e) => {
    // Hit enter keyboard, let's finish up
    if (e.key === 'Enter') {
      this.finishEdit(e);
    }
  };
}
