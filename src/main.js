import { RenderElementPosition, renderElement } from './util.js';
import TripInfoComponent from './components/trip-info.js';
import MenuComponent from './components/menu.js';
import FilterComponent from './components/filter.js';
import createSort from './components/sort.js';
import DayListComponent from './components/day-list.js';
import SortComponent from './components/sort.js';
import NoPointsComponent from './components/no-points.js';
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

const sortList = [
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

  if (eventList.length) {
    renderElement(tripInfoElement, RenderElementPosition.AFTER_BEGIN, new TripInfoComponent(eventList).getElement());
  };

  renderElement(tripControlElements[0], RenderElementPosition.AFTER_END, new MenuComponent(menuList).getElement());
  renderElement(tripControlElements[1], RenderElementPosition.AFTER_END, new FilterComponent(filterList).getElement());

  if (eventList.length) {
    renderElement(tripEventsElement, RenderElementPosition.AFTER_END, new DayListComponent(eventList).getElement());
  } else {
    renderElement(tripEventsElement, RenderElementPosition.AFTER_END, new NoPointsComponent(`Click New Event to create your first point`).getElement());
  };

  if (eventList.length) {
    renderElement(tripEventsElement, RenderElementPosition.AFTER_END, new SortComponent(sortList).getElement());
  };

};

renderIndex();

document.querySelector(`.trip-info__cost-value`).innerText = sumEvents(eventList);
