import * as _ from 'underscore';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import NoteStore from '../stores/NoteStore';
import config from '../configs/index';

// Promise based HTTP client for the browser and node.js
import * as axios from 'axios';

class LaneStore {

  /**
   * The constructor of Lane Store
   *
   * help to binding Lane actions
   */
  constructor() {
    this.bindActions(LaneActions);

    // init lanes store
    this.lanes = [];
  }

  /**
   * Gets all Lanes
   * using HTTP request to server to get data and set state.
   */
  getLanes() {
    let self = this;

    const request = axios.get(config.database.url + '/api/lanes');

    request.then(res => {
      const data = res.data;

      if (res.status == 400) {
        self.setState({lanes: []});
      } else {
        self.setState({lanes: data});
      }
    });
  }

  /**
   * Creates a new lane
   * using HTTP request to create a new lane and set to Lanes Store.
   *
   * @param  {Object} lane The new lane object.
   */
  create(lane) {
    let self = this;

    lane.name = lane.name || 'New Lane';
    lane.notes = lane.notes || [];

    const request = axios.post(config.database.url + '/api/lanes', {
      name: lane.name,
      editing: false,
      notes: lane.notes
    });

    request.then(res => {
      const data = res.data;
      const lanes = self.lanes.concat(data);

      console.log('after added lane:', lanes);

      self.setState({lanes});
    });
  }

  /**
   * Update the exists lane in the list of Lanes.
   * using HTTP request to update lane.
   *
   * @param  {Object} updateLane The lane update.
   */
  update(updateLane) {
    let self = this;
    let lanes = this.lanes;
    let noteUpdate = updateLane.noteUpdate || null;
    let notesUpdate = lanes.filter(lane => {
      return lane.id = updateLane.id;
    })[0].notes;

    if (noteUpdate) {
      notesUpdate = notesUpdate.map(note => {
        if (note.id === noteUpdate.id) {
          return Object.assign({}, note, noteUpdate);
        }
        return note;
      });
    }

    const request = axios.put(config.database.url + '/api/lanes/' + updateLane.id, {
      name: updateLane.name,
      notes: notesUpdate,
      editing: updateLane.editing
    });

    request.then(res => {
      const data = res.data;
      lanes = lanes.map(lane => {
        if (lane.id === data.id) {
          return Object.assign({}, lane, data);
        }
        return lane;
      });

      self.setState({lanes});
    });
  }

  /**
   * Delete the lane in the list of lanes
   * using HTTP request to delete lane
   *
   * @param {Int} laneId The id of lane
   */
  delete(laneId) {
    let self = this;
    const request = axios.delete(config.database.url + '/api/lanes/' + laneId);

    request.then(res => {
      console.log('::delete::lane::', res);
      self.setState({
        lanes: _.reject(self.lanes, lane => {
          return lane.id === laneId;
        })
      });
    });
  }

  attachToLane({laneId, note}) {
    let self = this;
    let lanes = this.lanes;

    if (!note) {
      this.waitFor(NoteStore);
      note = NoteStore.getState().notes.slice(-1)[0];
    }

    lanes = lanes.map(lane => {
      if (lane.id === laneId) {
        lane.notes = lane.notes || [];
        if (lane.notes.includes(note.id)) {
          console.warn('Already attached note to lane', lanes);
        } else {
          lane.notes.push(note);
        }
      }
      return lane;
    });

    // get only one lane update
    const laneUpdate = lanes.filter(lane => {
      return lane.id === laneId;
    })[0];

    // define HTTP request
    const request = axios.put(config.database.url + '/api/lanes/' + laneId, {
      name: laneUpdate.name,
      editing: laneUpdate.editing || false,
      notes: laneUpdate.notes
    });

    request.then(res => {
      console.log('attachToLane request success', res);
      self.setState({lanes});
    });
  }

  detachFromLane({laneId, noteId}) {
    let self = this;
    const lanes = this.lanes.map(lane => {
      if (lane.id === laneId) {
        lane.notes = _.reject(lane.notes, note => {
          return note === noteId;
        });
      }
      return lane;
    });

    // gets lane detach
    const laneUpdate = _.findWhere(lanes, {id: laneId});

    // define HTTP request
    const request = axios.put(config.database.url + '/api/lanes/' + laneId, {
      name: laneUpdate.name,
      editing: laneUpdate.editing || false,
      notes: laneUpdate.notes.filter(note => {
        return note.id !== noteId;
      })
    });

    request.then(res => {
      self.setState({lanes: [res.data]});
    });
  }
}

/**
 * Expose
 */
export default alt.createStore(LaneStore, 'LaneStore');
