import {RenderPosition, renderComponent} from './utils/render.js';
import MenuComponent from './components/menu.js';
import generateEventList from './mock/event-data.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import Events from './models/events.js';
import TripInfoController from './controllers/trip-info-controller.js';
import {TripMode, MenuMode} from './const.js';

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const statisticsElement = document.querySelector(`.statistics`);
const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const createEventElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const TRIP_EVENTS_HIDDEN_CLASS = `trip-events--hidden`;
const STATISTICS_HIDDEN_CLASS = `statistics--hidden`;

const events = new Events(generateEventList());

const tripInfoController = new TripInfoController(tripMainElement, events);
tripInfoController.render();

const filterController = new FilterController(tripControlElements[1], events);
filterController.render();

const tripController = new TripController(tripEventsElement, events);
tripController.setModeChangeHandler((mode) => {
  createEventElement.disabled = mode === TripMode.ADDING;
});

const menuComponent = new MenuComponent();
renderComponent(tripControlElements[0], RenderPosition.AFTER_END, menuComponent);
menuComponent.setModeChangeHandler(() => {
  tripEventsElement.classList.toggle(TRIP_EVENTS_HIDDEN_CLASS);
  statisticsElement.classList.toggle(STATISTICS_HIDDEN_CLASS);
});

tripController.render();

createEventElement.addEventListener(`click`, () => {
  menuComponent.setMode(MenuMode.TABLE);
  tripController.createEvent();
});
