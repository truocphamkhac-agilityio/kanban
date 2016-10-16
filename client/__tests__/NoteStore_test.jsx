import {expect} from 'chai';
import NoteActions from '../app/actions/NoteActions';
import NoteStore from '../app/stores/NoteStore';
import alt from '../app/libs/alt';

describe('NoteStore', () => {

  it('creates notes', () => {
    const task = 'test';

    NoteActions.create({task});

    const state = NoteStore.getState();

    expect(state.notes.length).to.equal(1);
    expect(state.notes[0].task).to.equal(task);
  });

  it('updates notes', () => {
    const task = 'test';
    const updatedTask = 'new test';

    // create note by note actions
    NoteActions.create({task});

    const note = NoteStore.getState().notes[0];
    note.task = updatedTask;

    // update note by note actions
    NoteActions.update({note});

    const state = NoteStore.getState();

    expect(state.notes.length).to.equal(2);
    expect(state.notes[0].task).to.equal(updatedTask);
  });

  it('deletes notes', () => {
    const task = 'test delete';

    // create note by note actions
    NoteActions.create({task});

    const note = NoteStore.getState().notes[0];

    // delete note by note actions
    NoteActions.delete(note.id);

    const state = NoteStore.getState();

    expect(state.notes.length).to.equal(2);
    expect(state.notes[0].task).to.not.equal(task);
  });

});
