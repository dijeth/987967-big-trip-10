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

  set(eventList) {
    this._events = eventList.map((it) => {
      it.id = this._generateID();
      return it;
    });
  }

  update(id, newEventData) {
    const index = this._events.findIndex((it) => it.id === id);

    switch (true) {
      case id === null:
        newEventData.id = this._generateID();
        this._events = [newEventData].concat(this._events);
        break;

      case index === -1:
        return;

      case newEventData === null:
        this._events = this._events.slice(0, index).concat(this._events.slice(index + 1, this._events.length));
        break;

      default:
        this._events[index] = newEventData;
        newEventData.id = id;
    }

    this._dataChangeHandlers.forEach((it) => it());
  }

  _generateID() {
    this._idCounter += 1;
    return this._idCounter;
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._filterChangeHandlers.forEach((it) => it(this._activeFilter));
  }

  getFilter() {
    return this._activeFilter;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
