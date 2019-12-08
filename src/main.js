import {RenderElementPosition, renderElement} from './util.js';
import TripInfoComponent from './components/trip-info.js';
import MenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import createSort from './components/sort.js';
import createTripList from './components/trip-list.js';
import generateEventList from './mock/event-data.js';

const eventList = generateEventList();

const menuList = [
  { name: `Table`, href: `#`, active: true },
  { name: `Stats`, href: `#`, active: false }
];

const filterList = [
  { name: `Everything`, checked: true },
  { name: `Future`, checked: false },
  { name: `Past`, checked: false }
];

const sortItemList = [
  { name: `Event`, checked: true, direction: false },
  { name: `Time`, checked: false, direction: true },
  { name: `Price`, checked: false, direction: true }
];

console.log(eventList);

const sumOffers = (offerList) => offerList.reduce((accum, current) => accum + current.checked * current.cost, 0);
const sumEvents = (events) => events.reduce((accum, current) => accum + current.cost + sumOffers(current.offers), 0);

const renderIndex = () => {
  const tripMainElement = document.querySelector(`.trip-main`);
  const tripEventsElement = document.querySelector(`.trip-events h2`);
  const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
  const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);

  renderElement(tripInfoElement, RenderElementPosition.AFTER_BEGIN, new TripInfoComponent(eventList).getElement());
  renderElement(tripControlElements[0], RenderElementPosition.AFTER_END, new MenuComponent(menuList).getElement());
  renderElement(tripControlElements[1], RenderElementPosition.AFTER_END, new FilterComponent(filterList).getElement());
  // renderElement(tripEventsElement, `${createSort(sortItemList)}\n${createTripList(eventList)}`, `afterend`);
};

renderIndex();

document.querySelector(`.trip-info__cost-value`).innerText = sumEvents(eventList);
