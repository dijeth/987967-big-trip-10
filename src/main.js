import {RenderPosition, renderComponent} from './utils/render.js';
import NoPointsController from './controllers/no-points-controller.js';
import MenuComponent from './components/menu.js';
import StatisticComponent from './components/stats.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import Events from './models/events.js';
import TripInfoController from './controllers/trip-info-controller.js';
import {TripMode, MenuMode} from './const.js';
import API from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {createDebounce} from './utils/debounce.js';

const DEBOUNCE_INTERVAL = 500;

const debounce = createDebounce(DEBOUNCE_INTERVAL, null, (func) => {
  func();
});

const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;
const AUTORIZATION = `Basic Jethro_Tull`;
const LOCAL_STORAGE_KEY = `big-trip-local-storage-key`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

const api = new API(END_POINT, AUTORIZATION);
const store = new Store(LOCAL_STORAGE_KEY, localStorage);
const provider = new Provider(api, store);

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const createEventElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const events = new Events();
const tripInfoController = new TripInfoController(tripMainElement, events);
tripInfoController.init();
const filterController = new FilterController(tripControlElements[1], events);

const tripController = new TripController(tripEventsElement, events, provider, debounce);
tripController.setModeChangeHandler((mode) => {
  createEventElement.disabled = mode === TripMode.ADDING;
});

const statisticsComponent = new StatisticComponent();
renderComponent(tripEventsElement, RenderPosition.AFTER_END, statisticsComponent);
events.setDataChangeHandler(statisticsComponent.dataChangeHandler);

const noPointsController = new NoPointsController(tripEventsElement, tripController);
noPointsController.render();

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

provider.getData().then((data) => {
  tripController.setDestinations(data.destinations);
  tripController.setOffers(data.offers);
  events.set(data.events);
});

window.addEventListener(`offline`, () => {
  document.title = `${document.title} [offline]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!provider.getSynchronize()) {
    provider.sync()
      .then((synchronizeIDs) => {
        events.synchronizeID(synchronizeIDs);
        tripController.synchronizeID(synchronizeIDs);
      });
  }
});
