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

  getEvents() {
    return Promise.all([
      this._load({ url: `points` }).then((response) => response.json()),
      this._load({ url: `offers` })
      .then((response) => response.json())
      .then((offerData) => new Offers(offerData))
    ]).then((values) => {
      const [eventList, offerList] = values;
      const eventData = EventModel.parseEvents(eventList, offerList);
      return new Promise((resolve) => {
        resolve(eventData)
      })
    });
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
