import { getDaysCount } from '../utils/common.js';
import { RenderPosition, renderComponent, replaceComponent, removeComponent } from '../utils/render.js';
import { SortOptions, SortType } from '../utils/sort.js';
import DayListComponent from '../components/day-list.js';
import SortComponent from '../components/sort.js';
import NoPointsComponent, { NO_POINTS_TEXT } from '../components/no-points.js';
import DayComponent from '../components/day.js';
import EventListComponent from '../components/event-list.js';
import EventController from './event-controller.js';

const splitEventsByDay = (eventList) => {
  const days = [];
  let dayCounter = 1;
  let dayDate = eventList[0].start;
  let dayEvents = [eventList[0]];

  for (let i = 1; i < eventList.length; i++) {
    const daysCount = getDaysCount(dayDate, eventList[i].start);

    if (daysCount === 0) {
      dayEvents.push(eventList[i]);
      continue;
    }

    days.push({ dayDate, dayCounter, dayEvents });
    dayCounter += daysCount;
    dayDate = eventList[i].start;
    dayEvents = [eventList[i]];
  }

  if (dayEvents.length) {
    days.push({ dayDate, dayCounter, dayEvents });
  }

  return days;
};

const sortEventsByTime = (eventList) => {
  const dayCounter = ``;
  const dayDate = ``;
  const dayEvents = eventList.slice().sort((a, b) => (+a.finish - a.start) - (b.finish - b.start));

  return [{ dayCounter, dayDate, dayEvents }];
};

const sortEventsByPrice = (eventList) => {
  const dayCounter = ``;
  const dayDate = ``;
  const dayEvents = eventList.slice().sort((a, b) => a.cost - b.cost);

  return [{ dayCounter, dayDate, dayEvents }];
};

export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._sortComponent = null;
    this._dayListComponent = null;

    this._activeSortType = SortType.DEFAULT;

    this._eventControllers = [];
    this._showenEvents = [];

    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);

    this._eventsModel.setFilterChangeHandler(this._filterChangeHandler)
  }

  _renderSort(activeSortType) {
    const sortItems = Object.entries(SortOptions).map((it) => {
      const [type, options] = it;
      const { name, showDirection } = options;
      return { type, name, showDirection, checked: type === activeSortType };
    });

    console.log(activeSortType);
    console.log(sortItems);

    const sortComponent = new SortComponent(sortItems);
    sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);

    if (this._sortComponent) {
      replaceComponent(sortComponent, this._sortComponent);
    } else {
      renderComponent(this._container, RenderPosition.BEFORE_END, sortComponent);
    };

    this._sortComponent = sortComponent;
  }

  _renderEvents(events) {
    this._dayListComponent = new DayListComponent();

    const days = SortOptions[this._activeSortType].sort(this._showenEvents);

    this._eventControllers = this._renderDays(this._dayListComponent.getElement(), days);

    renderComponent(this._container, RenderPosition.BEFORE_END, this._dayListComponent);
  }

  _removeEvents() {
    this._eventControllers.forEach((it) => it.destroy())
    this._eventControllers = [];

    removeComponent(this._dayListComponent);
  }

  _updateEvents(events) {
    this._removeEvents();
    this._renderEvents(events);
  }

  render() {
    this._showenEvents = this._eventsModel.get().slice();

    if (!this._showenEvents.length) {
      renderComponent(this._container, RenderPosition.BEFORE_END, new NoPointsComponent(NO_POINTS_TEXT));
      return;
    };

    this._renderSort(this._activeSortType);
    this._renderEvents(this._showenEvents);




    // const oldDayListComponent = this._dayListComponent;

    // let sortedDays = [];

    // if (this._showenEvents.length) {
    //   this._sortComponent.setSortTypeChangeHandler((sortType) => {
    //     switch (sortType) {
    //       case SortType.TIME:
    //         sortedDays = sortEventsByTime(this._showenEvents);
    //         break;

    //       case SortType.PRICE:
    //         sortedDays = sortEventsByPrice(this._showenEvents);
    //         break;

    //       default:
    //       case SortType.DEFAULT:
    //         sortedDays = splitEventsByDay(this._showenEvents);
    //         break;
    //     }

    //     this._dayListComponent.getElement().innerHTML = ``;
    //     this._renderDays(this._dayListComponent.getElement(), sortedDays);
    //   });


    //   if (oldDayListComponent === null) {
    //     renderComponent(this._container, RenderPosition.BEFORE_END, this._dayListComponent)
    //   } else {
    //     replaceComponent(this._dayListComponent, oldDayListComponent);
    //   }

    // } else {
    //   renderComponent(this._container, RenderPosition.BEFORE_END, new NoPointsComponent(NO_POINTS_TEXT));
    // }
  }

  _renderDayEvents(container, eventList) {
    return eventList.map((it) => new EventController(container, this._onDataChange, this._viewChangeHandler).render(it));
  }

  _renderDays(container, dayList) {
    let eventControllers = [];

    dayList.forEach((it) => {
      const dayComponent = new DayComponent(it);
      const dayEventListComponent = new EventListComponent();

      renderComponent(container, RenderPosition.BEFORE_END, dayComponent);
      renderComponent(dayComponent.getElement(), RenderPosition.BEFORE_END, dayEventListComponent);

      eventControllers = eventControllers.concat(this._renderDayEvents(dayEventListComponent.getElement(), it.dayEvents));
    });

    return eventControllers;
  }

  _onDataChange(eventController, oldEventData, newEventData, eventViewMode) {
    eventController.render(newEventData, eventViewMode);
  }

  _viewChangeHandler() {
    this._eventControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _filterChangeHandler() {
    this._showenEvents = this._eventsModel.getFiltered().slice();
    this._updateEvents(this._showenEvents);
  }

  _sortTypeChangeHandler(activeSortType) {
    this._activeSortType = activeSortType;
    this._updateEvents(this._showenEvents);
  }
}
