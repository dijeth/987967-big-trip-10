import { RenderElementPosition, renderElement } from './util.js';
import TripInfoComponent from './components/trip-info.js';
import MenuComponent, {menuList} from './components/menu.js';
import FilterComponent, {filterList} from './components/filter.js';
import generateEventList from './mock/event-data.js';

import TripController from './controllers/trip-controller.js'

const eventList = generateEventList();

console.log(eventList);

const sumOffers = (offerList) => offerList.reduce((accum, current) => accum + current.checked * current.cost, 0);
const sumEvents = (events) => events.reduce((accum, current) => accum + current.cost + sumOffers(current.offers), 0);

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);

const tripController = new TripController(tripEventsElement, eventList);

if (eventList.length) {
  renderElement(tripInfoElement, RenderElementPosition.AFTER_BEGIN, new TripInfoComponent(eventList).getElement());
};

renderElement(tripControlElements[0], RenderElementPosition.AFTER_END, new MenuComponent(menuList).getElement());
renderElement(tripControlElements[1], RenderElementPosition.AFTER_END, new FilterComponent(filterList).getElement());

tripController.render();

document.querySelector(`.trip-info__cost-value`).innerText = sumEvents(eventList);
