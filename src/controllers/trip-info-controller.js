import TripInfoComponent from '../components/trip-info.js';
import { getShortDate } from '../utils/common.js';
import { replaceComponent, renderComponent, RenderPosition } from '../utils/render.js';

class TripInfoController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._tripInfoComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._eventsModel.setDataChangeHandler(this._dataChangeHandler);
  }

  _render() {
    const eventList = this._eventsModel.get().slice().sort((a, b) => +a.start - b.start);
    const tripInfoComponent = new TripInfoComponent(
      this._getDateTitle(eventList),
      this._getShortTrip(eventList),
      this._getInfoCost(eventList)
    );

    if (this._tripInfoComponent) {
      replaceComponent(tripInfoComponent, this._tripInfoComponent);
    } else {
      renderComponent(this._container, RenderPosition.AFTER_BEGIN, tripInfoComponent);
    }

    this._tripInfoComponent = tripInfoComponent;
  }

  _dataChangeHandler() {
    this._render();
  }

  _getDateTitle(eventList) {
    if (!eventList.length) {
      return ``
    };

    const tripStart = eventList[0].start;
    const tripFinish = eventList.length > 1 ? eventList[eventList.length - 1].finish : eventList[0].finish;

    return `${getShortDate(tripStart)}&nbsp;&mdash;&nbsp;${getShortDate(tripFinish)}`;
  }

  _getShortTrip(eventList) {
    switch (eventList.length) {
      case 0:
        return ``;

      case 1:
      case 2:
      case 3:
        return eventList.map((it) => it.destination.name);

      default:
        return [eventList[0].destination.name, `...`, eventList[eventList.length - 1].destination.name];
    }
  }

  _getInfoCost(eventList) {
    const sumOffers = (offerList) => offerList.reduce((accum, current) => accum + current.price, 0);

    return eventList.reduce((accum, current) => accum + current.cost + sumOffers(current.offers), 0);
  }
}

export default TripInfoController;
