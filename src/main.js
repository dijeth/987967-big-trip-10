import { RenderPosition, renderComponent, removeComponent } from './utils/render.js';
import NoPointsComponent from './components/no-points.js';
import MenuComponent from './components/menu.js';
import StatisticComponent from './components/stats.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import Events from './models/events.js';
import TripInfoController from './controllers/trip-info-controller.js';
import { TripMode, MenuMode } from './const.js';
import API from './api.js'

const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;
const AUTORIZATION = `Basic er883jdzbdw`;
const api = new API(END_POINT, AUTORIZATION);

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const createEventElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const events = new Events();
const tripInfoController = new TripInfoController(tripMainElement, events);
const filterController = new FilterController(tripControlElements[1], events);

const tripController = new TripController(tripEventsElement, events);
tripController.setModeChangeHandler((mode) => {
  createEventElement.disabled = mode === TripMode.ADDING;
});

const statisticsComponent = new StatisticComponent();
renderComponent(tripEventsElement, RenderPosition.AFTER_END, statisticsComponent);
events.setDataChangeHandler(statisticsComponent.dataChangeHandler);

const noPointsComponent = new NoPointsComponent();
tripController.setModeChangeHandler((mode) => {
  if (mode === TripMode.EMPTY) {
    renderComponent(tripEventsElement, RenderPosition.BEFORE_END, noPointsComponent);
  } else {
    removeComponent(noPointsComponent);
  }
});

const menuComponent = new MenuComponent();
renderComponent(tripControlElements[0], RenderPosition.AFTER_END, menuComponent);
menuComponent.setModeChangeHandler((mode) => {
  switch (mode) {
    case MenuMode.TABLE:
      statisticsComponent.hide();
      tripController.show();
      filterController.show();
      break;

    case MenuMode.STATS:
      tripController.hide();
      filterController.hide();
      statisticsComponent.show();
      statisticsComponent.render(events.get().slice());

      break;
  }
});

createEventElement.addEventListener(`click`, () => {
  menuComponent.setMode(MenuMode.TABLE);
  tripController.createEvent();
});

statisticsComponent.hide();

api.getDestinations().then((data) => tripController.setDestinations(data));
api.getEvents().then((eventData) => events.set(eventData));
