import EventModel from '../models/event.js';
import nanoid from "nanoid";

const OFFERS_KEY = `offers`;
const DESTINATIONS_KEY = `destinations`;

const getSyncedEvents = (data) => {
  return data.filter((it) => it.success).map((it) => payload.point);
}

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynced = true;
  }

  getSynchronize() {
    return this._isSynced;
  }  

  getData() {debugger;
    if (this._isOnLine()) {
      return this._api.getData().then((response) => {
        this._store.clear();

        this._store.setItem(OFFERS_KEY, response.offers);
        this._store.setItem(DESTINATIONS_KEY, response.destinations);
        response.events.forEach((it) => this._store.setItem(it.id, it.toRAW()))

        return response;
      });
    }

    this._isSynced = false;

    const store = this._store.getAll();
    const offers = store[OFFERS_KEY];
    const destinations = store[DESTINATIONS_KEY];

    delete store[OFFERS_KEY];
    delete store[DESTINATIONS_KEY];

    const events = EventModel.parseEvents(Object.values(store))

    return Promise.resolve({
      offers,
      destinations,
      events
    })
  }

  createEvent(data) {
    if (this._isOnLine()) {
      return this._api.createEvent(data)
        .then((response) => {
          this._store.setItem(response.id, response.toRAW());
          return response
        })
    };

    this._isSynced = false;

    const newID = nanoid();
    const newEvent = Object.assign({}, data.toRAW(), { id: newID });
    this._store.setItem(newID, Object.assign({}, newEvent, { offline: true }));

    return Promise.resolve(new EventModel(newEvent));
  }

  updateEvent(id, data) {
    if (this._isOnLine()) {
      return this._api.updateEvent(id, data)
        .then((response) => {
          this._store.setItem(response.id, response.toRAW());
          return response
        })
    };

    this._isSynced = false;

    this._store.setItem(id, Object.assign({}, data.toRAW(), { offline: true }));

    return Promise.resolve(data);
  }

  deleteEvent(id) {
    if (this._isOnLine()) {
      return this._api.deleteEvent(id)
        .then(() => {
          this._store.deleteItem(id);
        })
    };

    this._isSynced = false;

    this._store.deleteItem(id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const store = this._store.getAll();

      delete store[OFFERS_KEY];
      delete store[DESTINATIONS_KEY];

      return this._api.sync(Object.values(store))
        .then((response) => {
          store.filter((item) => item.offline).forEach((item) => {
            this._store.removeItem(item.id);
          });

          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          [...createdEvents, ...updatedEvents].forEach((item) => {
            this._store.setItem(item.id, item);
          });

          this._isSynced = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
