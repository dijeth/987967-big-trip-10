import { RenderPosition, renderComponent } from './utils/render.js';
import MenuComponent from './components/menu.js';
import StatisticComponent from './components/stats.js';
import generateEventList from './mock/event-data.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import Events from './models/events.js';
import TripInfoController from './controllers/trip-info-controller.js';
import { TripMode, MenuMode } from './const.js';

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const createEventElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const events = new Events([]);
// const events = new Events(generateEventList());

const tripInfoController = new TripInfoController(tripMainElement, events);
tripInfoController.render();

const filterController = new FilterController(tripControlElements[1], events);
filterController.render();

const tripController = new TripController(tripEventsElement, events);
tripController.setModeChangeHandler((mode) => {
  createEventElement.disabled = mode === TripMode.ADDING;
});

const statisticsComponent = new StatisticComponent();
renderComponent(tripEventsElement, RenderPosition.AFTER_END, statisticsComponent);

const menuComponent = new MenuComponent();
renderComponent(tripControlElements[0], RenderPosition.AFTER_END, menuComponent);
menuComponent.setModeChangeHandler((mode) => {
  switch (mode) {
    case MenuMode.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;

    case MenuMode.STATS:
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});

tripController.render();
statisticsComponent.hide();

createEventElement.addEventListener(`click`, () => {
  menuComponent.setMode(MenuMode.TABLE);
  tripController.createEvent();
});
