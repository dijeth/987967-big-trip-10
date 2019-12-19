export default class Events {
  constructor(eventList) {
    this._events = [];
    this._idCounter = 0;
    this._dataChangeHandlers = [];

    if (eventList) {
      this.set(eventList)
    };
  }

  get() {
    return this._events;
  }

  set(eventList) {
    this._events = eventList.map((it) => {
      it.id = this._generateId();
      return it;
    });
  }

  update(id, newEventData) {
    const index = this._events.findIndex((it) => it.id === id);

    switch (true) {
      case index === -1:
        return;

      case id === null:
        newEventData.id = this._generateID();
        this._events = [newEventData].concat(this._events);
        break;

      case newEventData === null:
        this._events = this._events.slice(0, index).concat(this._events.slice(index + 1, this._events.length));
        break;

      default:
        this._events[index] = newEventData;
        newEventData.id = id;
    }

    this._dataChangeHandlers.forEach((it) => it());
  }

  _generateId() {
    this._idCounter += 1;
    return this._idCounter;
  }
}