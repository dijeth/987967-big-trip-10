import {FilterType, FilterOptions} from '../utils/filter.js';

export default class Events {
  constructor(eventList) {
    this._events = [];
    this._idCounter = 0;
    this._activeFilter = FilterType.EVERYTHING;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];

    if (eventList) {
      this.set(eventList);
    }
  }

  get() {
    return this._events;
  }

  getFiltered() {
    return this._events.filter((it) => FilterOptions[this._activeFilter].check(it));
  }

  getFilter() {
    return this._activeFilter;
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._filterChangeHandlers.forEach((it) => it(this._activeFilter));
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  set(eventList) {
    this._events = eventList;
    this._dataChangeHandlers.forEach((it) => it());
  }

  update(id, newEventData) {
    const index = this._events.findIndex((it) => it.id === id);
    this._events[index] = newEventData;
    this._dataChangeHandlers.forEach((it) => it());
  }

  delete(id) {
    const index = this._events.findIndex((it) => it.id === id);
    this._events = this._events.slice(0, index).concat(this._events.slice(index + 1, this._events.length));
    this._dataChangeHandlers.forEach((it) => it());
  }

  create(newEventData) {
    this._events = [newEventData].concat(this._events);
    this._dataChangeHandlers.forEach((it) => it());
  }

  synchronizeID(synchronizeIDs) {
    synchronizeIDs.forEach((syncID) => {
      this._events.find((it) => it.id === syncID.oldID).id = syncID.newID;
    });
  }
}
