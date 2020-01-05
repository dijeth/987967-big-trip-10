import Offers from './models/offers.js';
import EventModel from './models/event.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getDestinations() {
    return this._load({ url: `destinations` }).then((response) => response.json())
  }

  getOffers() {
    return this._load({ url: `offers` })
      .then((response) => response.json())
      .then((offerData) => new Offers(offerData))
  }

  getEvents() {
    return Promise.all([
      this._load({ url: `points` }).then((response) => response.json()),
      this.getOffers()
    ]).then((values) => {
      const [eventList, offerList] = values;
      return EventModel.parseEvents(eventList, offerList);
    });
  }

  createEvent(eventModel) {
    return this._load({
        url: `points`,
        method: Method.POST,
        body: JSON.stringify(eventModel.toRAW()),
        headers: new Headers({ 'Content-Type': `application/json` })
      })
      .then((response) => response.json())
      .then((data) => new EventModel(data));
  }

  updateEvent(id, data) {
    return this._load({
        url: `points/${id}`,
        method: Method.PUT,
        body: JSON.stringify(data.toRAW()),
        headers: new Headers({ 'Content-Type': `application/json` })
      })
      .then((response) => response.json())
      .then((data) => new EventModel(data));
  }

  deleteEvent(id) {
    return this._load({ url: `points/${id}`, method: Method.DELETE });
  }


  _load({ url, method = Method.GET, body = null, headers = new Headers() }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
