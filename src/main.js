import {createTripInfo} from './components/trip-info.js';
import {createMenu} from './components/menu.js';
import {createFilter} from './components/filter.js';
import {createSort} from './components/sort.js';
import {createTripDays} from './components/trip-list.js';

const tripList = [`Amsterdam`, `Vienna`, `Budapest`];
const dateList = [`Mar 21`, `Mar 25`, `Mar 31`];
const filterList = [`Everything`, `Future`, `Past`];
const tripDayList = [{
  dayCounter: 1,
  dayDate: `2019-03-18`,
  dayDateText: `MAR 18`,

  eventList: [
    {type: `flight`, title: `Flight to Geneva`, startTime: `12:25`, endTime: `13:35`, duration: `1H 30M`, price: `160`, offers: [{title: `Add luggage`, price: `50`}, {title: `Switch to comfort`, price: `80`}]},
    {type: `check-in`, title: `Check into hotel`, startTime: `12:25`, endTime: `13:35`, duration: `1H 30M`, price: `600`, offers: [{title: `Add breakfast`, price: `50`}]}
  ]
},
{
  dayCounter: 2,
  dayDate: `2019-03-19`,
  dayDateText: `MAR 19`,

  eventList: [
    {type: `drive`, title: `Drive to Geneva`, startTime: `10:00`, endTime: `11:00`, duration: `1H`, price: `20`, offers: []}
  ]
}
];

/* const EventIconDict = {
  "taxi": `taxi.png`,
  "bus": `bus.png`,
  "train": `train.png`,
  "ship": `ship.png`,
  "transport": `transport.png`,
  "drive": `drive.png`,
  "flight": `flight.png`,
  'check-in': `check-in.png`,
  "sightseeing": `sightseeing.png`,
  "restaurant": `restaurant.png`
};
*/

const render = (container, html, position = `beforeend`) => {
  container.insertAdjacentHTML(position, html);
};


const renderIndex = () => {
  const tripMainElement = document.querySelector(`.trip-main`);
  const tripEventsElement = document.querySelector(`.trip-events h2`);
  const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
  const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);

  render(tripInfoElement, createTripInfo(tripList, dateList), `afterbegin`);
  render(tripControlElements[0], createMenu(), `afterend`);
  render(tripControlElements[1], createFilter(filterList), `afterend`);
  render(tripEventsElement, `${createSort()}\n${createTripDays(tripDayList)}`, `afterend`);
};

renderIndex();
