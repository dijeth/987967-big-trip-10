import TripInfoComponent from '../components/trip-info.js';
import {getShortDate} from '../utils/common.js';
import {replaceComponent, renderComponent, RenderPosition} from '../utils/render.js';

class TripInfoController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._tripInfoComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._eventsModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    if (this._eventsModel.get().length) {
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
    } else {
      if (this._tripInfoComponent) {
        this._tripInfoComponent.hide();
      }
    }
  }

  _dataChangeHandler() {
    this.render();
  }

  _getDateTitle(eventList) {
    const tripStart = eventList[0].start;
    const tripFinish = eventList.length > 1 ? eventList[eventList.length - 1].finish : eventList[0].finish;

    return `${getShortDate(tripStart)}&nbsp;&mdash;&nbsp;${getShortDate(tripFinish)}`;
  }

  _getShortTrip(eventList) {
    switch (true) {
      case eventList.length === 1:
        return [eventList[0].destination];

      case eventList.length === 2:
        return [eventList[0].destination, eventList[1].destination];

      default:
      case eventList.length > 2:
        return [eventList[0].destination, `...`, eventList[eventList.length - 1].destination];
    }
  }

  _getInfoCost(eventList) {
    const sumOffers = (offerList) => offerList.reduce((accum, current) => accum + current.checked * current.cost, 0);

    return eventList.reduce((accum, current) => accum + current.cost + sumOffers(current.offers), 0);
  }
}

export default TripInfoController;
