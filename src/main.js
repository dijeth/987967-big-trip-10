import {RenderPosition, renderComponent, removeComponent} from './utils/render.js';
import NoPointsComponent from './components/no-points.js';
import MenuComponent from './components/menu.js';
import StatisticComponent from './components/stats.js';
import generateEventList from './mock/event-data.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter-controller.js';
import Events from './models/events.js';
import TripInfoController from './controllers/trip-info-controller.js';
import {TripMode, MenuMode} from './const.js';

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const createEventElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);

// const events = new Events([]);
const events = new Events(generateEventList());
// const events = new Events(
//   [{
//       "id": null,
//       "type": "Check-in",
//       "start": moment(`2020-1-07 9:00`, `YYYY-M-D h:m`).toDate(),
//       "finish": moment(`2020-1-07 10:45`, `YYYY-M-D h:m`).toDate(),
//       "destination": "Minsk",
//       "cost": 566,
//       "isFavorite": false,
//       "offers": [{ "type": "meal", "checked": false, "cost": 16 }]
//     },
//     {
//       "id": null,
//       "type": "Restaurant",
//       "start": moment(`2020-1-07 12:00`, `YYYY-M-D h:m`).toDate(),
//       "finish": moment(`2020-1-07 10:00`, `YYYY-M-D h:m`).toDate(),
//       "destination": "Minsk",
//       "cost": 367,
//       "isFavorite": true,
//       "offers": []
//     },
//     {
//       "id": null,
//       "type": "Ship",
//       "start": moment(`2020-1-13 9:00`, `YYYY-M-D h:m`).toDate(),
//       "finish": moment(`2020-1-15 19:00`, `YYYY-M-D h:m`).toDate(),
//       "destination": "Milan",
//       "cost": 481,
//       "isFavorite": false,
//       "offers": [{
//           "type": "luggage",
//           "checked": true,
//           "cost": 44
//         },
//         {
//           "type": "comfort",
//           "checked": true,
//           "cost": 129
//         },
//         {
//           "type": "meal",
//           "checked": false,
//           "cost": 171
//         },
//         {
//           "type": "seats",
//           "checked": true,
//           "cost": 140
//         }
//       ]
//     },
//     {
//       "id": null,
//       "type": "Flight",
//       "start": moment(`2020-1-15 19:00`, `YYYY-M-D h:m`).toDate(),
//       "finish": moment(`2020-1-16 9:00`, `YYYY-M-D h:m`).toDate(),
//       "destination": "Odessa",
//       "cost": 174,
//       "isFavorite": false,
//       "offers": [{
//           "type": "luggage",
//           "checked": false,
//           "cost": 13
//         },
//         {
//           "type": "comfort",
//           "checked": false,
//           "cost": 111
//         },
//         {
//           "type": "meal",
//           "checked": false,
//           "cost": 23
//         },
//         {
//           "type": "seats",
//           "checked": false,
//           "cost": 94
//         },
//         {
//           "type": "train",
//           "checked": true,
//           "cost": 37
//         }
//       ]
//     },
//     {
//       "id": null,
//       "type": "Bus",
//       "start": moment(`2020-1-16 19:00`, `YYYY-M-D h:m`).toDate(),
//       "finish": moment(`2020-1-17 9:00`, `YYYY-M-D h:m`).toDate(),
//       "destination": "Barcelona",
//       "cost": 958,
//       "isFavorite": true,
//       "offers": [{ "type": "seats", "checked": true, "cost": 71 }]
//     }/*,
//     {
//       "id": null,
//       "type": "Trip",
//       "start": moment(`2020-10-07 9:00`, `YYYY-M-D h:m`),
//       "finish": moment(`2020-10-07 9:00`, `YYYY-M-D h:m`),
//       "destination": "Warsaw",
//       "cost": 780,
//       "isFavorite": true,
//       "offers": []
//     },
//     {
//       "id": null,
//       "type": "Taxi",
//       "start": moment(`2020-10-07 9:00`, `YYYY-M-D h:m`),
//       "finish": moment(`2020-10-07 9:00`, `YYYY-M-D h:m`),
//       "destination": "Perm",
//       "cost": 718,
//       "isFavorite": false,
//       "offers": []
//     }*/
//   ]
// );

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
events.setDataChangeHandler(statisticsComponent.dataChangeHandler);
statisticsComponent.render(events.get().slice());

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

tripController.render();
statisticsComponent.hide();
