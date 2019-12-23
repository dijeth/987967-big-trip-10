import { RenderPosition, renderComponent } from './utils/render.js';
import { FilterType } from './utils/filter.js';
import TripInfoComponent from './components/trip-info.js';
import MenuComponent, { menuList } from './components/menu.js';
import generateEventList from './mock/event-data.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import Events from './models/events.js';

const sumOffers = (offerList) => offerList.reduce((accum, current) => accum + current.checked * current.cost, 0);
const sumEvents = (events) => events.reduce((accum, current) => accum + current.cost + sumOffers(current.offers), 0);

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const createEventElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const events = new Events(generateEventList());

const filterController = new FilterController(tripControlElements[1], events);
filterController.render();

const tripController = new TripController(tripEventsElement, events);
createEventElement.addEventListener(`click`, tripController.createEvent);

// if (eventList.length) {
//   renderComponent(tripInfoElement, RenderPosition.AFTER_BEGIN, new TripInfoComponent(eventList));
// }

renderComponent(tripControlElements[0], RenderPosition.AFTER_END, new MenuComponent(menuList));

tripController.render();

// document.querySelector(`.trip-info__cost-value`).innerText = sumEvents(eventList);
